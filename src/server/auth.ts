// SOLO SERVIDOR. Usuarios del panel /tool y sesiones.
// Solo usa WebCrypto (crypto.subtle), disponible tanto en Cloudflare Workers como en Node.
import { deleteCookie, getCookie, getRequestIP, getRequestProtocol, setCookie } from "@tanstack/react-start/server";
import { KEYS, getVar, readJson, readText, withLock, writeJson, writeText } from "./kv";

export type Role = "admin" | "editor";

type StoredUser = {
  id: string;
  username: string;
  role: Role;
  salt: string;
  hash: string;
  /** Iteraciones PBKDF2 con las que se calculó el hash (permite subirlas más adelante). */
  iter: number;
  /** Se incrementa al cambiar la contraseña o el rol: invalida las sesiones abiertas. */
  ver: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

export type PublicUser = Pick<StoredUser, "id" | "username" | "role" | "createdAt" | "updatedAt" | "lastLoginAt">;

const COOKIE = "akm_tool";
const SESSION_HOURS = 12;

// Usuario principal que se crea la primera vez que arranca el panel
const SEED_USER = { username: "AKM_Admin", password: "AKM2026", role: "admin" as Role };

export const USERNAME_RE = /^[A-Za-z0-9_.-]{3,32}$/;
export const PASSWORD_MIN = 6;

export class AuthError extends Error {}
/** La sesión no existe o ha caducado: el panel vuelve a la pantalla de login. */
export class SessionError extends AuthError {}

// ── Utilidades de bytes ──────────────────────────────────────────────────────

const enc = new TextEncoder();
const toHex = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
const fromHex = (h: string) => new Uint8Array(h.match(/../g)?.map((x) => parseInt(x, 16)) ?? []);
const randomBytes = (n: number) => crypto.getRandomValues(new Uint8Array(n));

const toB64url = (b: Uint8Array) =>
  btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64url = (s: string) =>
  Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

/** Comparación en tiempo constante. */
function equalBytes(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

// ── Contraseñas (PBKDF2-SHA256) ──────────────────────────────────────────────

// 100.000 es el máximo que admite WebCrypto en Cloudflare Workers.
const pbkdf2Iterations = () =>
  Math.min(100_000, Math.max(10_000, Number(getVar("AKM_PBKDF2_ITERATIONS")) || 100_000));

async function pbkdf2(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return new Uint8Array(bits);
}

async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const iter = pbkdf2Iterations();
  const hash = await pbkdf2(password, salt, iter);
  return { salt: toHex(salt), hash: toHex(hash), iter };
}

async function verifyPassword(password: string, user: StoredUser) {
  const hash = await pbkdf2(password, fromHex(user.salt), user.iter);
  return equalBytes(hash, fromHex(user.hash));
}

// ── Usuarios ─────────────────────────────────────────────────────────────────

const toPublic = ({ id, username, role, createdAt, updatedAt, lastLoginAt }: StoredUser): PublicUser => ({
  id, username, role, createdAt, updatedAt, lastLoginAt,
});

async function loadUsers(): Promise<StoredUser[]> {
  const users = await readJson<StoredUser[]>(KEYS.users);
  if (Array.isArray(users) && users.length) return users;
  // Primera ejecución: se crea el administrador principal
  return withLock(KEYS.users, async () => {
    const again = await readJson<StoredUser[]>(KEYS.users);
    if (Array.isArray(again) && again.length) return again;
    const now = new Date().toISOString();
    const seed: StoredUser = {
      id: crypto.randomUUID(),
      username: SEED_USER.username,
      role: SEED_USER.role,
      ...(await hashPassword(SEED_USER.password)),
      ver: 1,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
    };
    await writeJson(KEYS.users, [seed]);
    return [seed];
  });
}

async function mutateUsers<T>(fn: (users: StoredUser[]) => Promise<T> | T): Promise<T> {
  await loadUsers(); // garantiza que existe el administrador inicial
  return withLock(KEYS.users, async () => {
    const users = (await readJson<StoredUser[]>(KEYS.users)) ?? [];
    const result = await fn(users);
    await writeJson(KEYS.users, users);
    return result;
  });
}

export async function listUsers(): Promise<PublicUser[]> {
  return (await loadUsers()).map(toPublic);
}

function validatePassword(password: string) {
  if (password.length < PASSWORD_MIN) throw new AuthError(`La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`);
  if (password.length > 200) throw new AuthError("La contraseña es demasiado larga.");
}

export function createUser(input: { username: string; password: string; role: Role }) {
  const username = input.username.trim();
  if (!USERNAME_RE.test(username)) {
    throw new AuthError("El usuario debe tener entre 3 y 32 caracteres: letras, números, punto, guion o guion bajo.");
  }
  validatePassword(input.password);
  return mutateUsers(async (users) => {
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      throw new AuthError("Ya existe un usuario con ese nombre.");
    }
    const now = new Date().toISOString();
    const user: StoredUser = {
      id: crypto.randomUUID(),
      username,
      role: input.role,
      ...(await hashPassword(input.password)),
      ver: 1,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
    };
    users.push(user);
    return toPublic(user);
  });
}

export function updateUser(actorId: string, id: string, changes: { role?: Role; password?: string }) {
  if (changes.password !== undefined) validatePassword(changes.password);
  return mutateUsers(async (users) => {
    const user = users.find((u) => u.id === id);
    if (!user) throw new AuthError("El usuario no existe.");
    if (changes.role && changes.role !== user.role) {
      if (user.id === actorId) throw new AuthError("No puedes cambiar tu propio rol.");
      if (user.role === "admin" && users.filter((u) => u.role === "admin").length === 1) {
        throw new AuthError("Debe quedar al menos un administrador.");
      }
      user.role = changes.role;
      user.ver++;
    }
    if (changes.password !== undefined) {
      Object.assign(user, await hashPassword(changes.password));
      user.ver++;
    }
    user.updatedAt = new Date().toISOString();
    return toPublic(user);
  });
}

export function deleteUser(actorId: string, id: string) {
  return mutateUsers((users) => {
    const i = users.findIndex((u) => u.id === id);
    if (i === -1) throw new AuthError("El usuario no existe.");
    if (users[i].id === actorId) throw new AuthError("No puedes eliminar tu propio usuario.");
    if (users[i].role === "admin" && users.filter((u) => u.role === "admin").length === 1) {
      throw new AuthError("Debe quedar al menos un administrador.");
    }
    users.splice(i, 1);
  });
}

export async function changeOwnPassword(userId: string, current: string, next: string) {
  validatePassword(next);
  const user = await mutateUsers(async (users) => {
    const u = users.find((x) => x.id === userId);
    if (!u) throw new AuthError("Sesión no válida.");
    if (!(await verifyPassword(current, u))) throw new AuthError("La contraseña actual no es correcta.");
    Object.assign(u, await hashPassword(next));
    u.ver++;
    u.updatedAt = new Date().toISOString();
    return u;
  });
  await issueSession(user); // las demás sesiones de este usuario quedan cerradas
}

// ── Sesiones (cookie firmada con HMAC-SHA256) ────────────────────────────────

let hmacKeyPromise: Promise<CryptoKey> | undefined;
function getHmacKey() {
  hmacKeyPromise ??= (async () => {
    let secret = getVar("AKM_SESSION_SECRET");
    if (!secret) {
      secret = (await readText(KEYS.secret))?.trim();
      if (!secret) {
        secret = toHex(randomBytes(32));
        await writeText(KEYS.secret, secret);
      }
    }
    return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  })().catch((err) => {
    hmacKeyPromise = undefined; // reintentar en la próxima petición
    throw err;
  });
  return hmacKeyPromise;
}

async function sign(data: string) {
  return new Uint8Array(await crypto.subtle.sign("HMAC", await getHmacKey(), enc.encode(data)));
}

async function issueSession(user: StoredUser) {
  const payload = toB64url(enc.encode(JSON.stringify({ u: user.id, v: user.ver, e: Date.now() + SESSION_HOURS * 3600_000 })));
  const token = `${payload}.${toB64url(await sign(payload))}`;
  setCookie(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: getRequestProtocol() === "https",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function getSessionUser(): Promise<PublicUser | null> {
  const token = getCookie(COOKIE);
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  try {
    if (!equalBytes(await sign(payload), fromB64url(sig))) return null;
    const { u, v, e } = JSON.parse(new TextDecoder().decode(fromB64url(payload)));
    if (typeof e !== "number" || e < Date.now()) return null;
    const user = (await loadUsers()).find((x) => x.id === u);
    if (!user || user.ver !== v) return null;
    return toPublic(user);
  } catch {
    return null;
  }
}

export async function requireUser(role?: Role): Promise<PublicUser> {
  const user = await getSessionUser();
  if (!user) throw new SessionError("Tu sesión ha caducado. Vuelve a iniciar sesión.");
  if (role === "admin" && user.role !== "admin") throw new AuthError("Solo los administradores pueden hacer esto.");
  return user;
}

// ── Login con freno a la fuerza bruta ────────────────────────────────────────
// El contador vive en memoria de cada instancia del Worker: frena ataques desde un
// mismo origen sin gastar escrituras de KV (el plan gratuito tiene 1.000/día).

const attempts = new Map<string, { fails: number; until: number }>();
const MAX_FAILS = 5;
const LOCK_MS = 5 * 60_000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function login(username: string, password: string): Promise<PublicUser> {
  const ip = getRequestIP({ xForwardedFor: true }) ?? "local";
  const key = `${ip}|${username.toLowerCase()}`;
  const state = attempts.get(key);
  if (state && state.until > Date.now()) {
    const min = Math.ceil((state.until - Date.now()) / 60_000);
    throw new AuthError(`Demasiados intentos. Espera ${min} min y vuelve a probar.`);
  }

  const users = await loadUsers();
  const user = users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
  const ok = user ? await verifyPassword(password, user) : (await hashPassword(password), false);

  if (!user || !ok) {
    const fails = (state?.fails ?? 0) + 1;
    attempts.set(key, { fails, until: fails >= MAX_FAILS ? Date.now() + LOCK_MS : 0 });
    if (attempts.size > 5000) attempts.clear();
    await sleep(400);
    throw new AuthError("Usuario o contraseña incorrectos.");
  }

  attempts.delete(key);
  const stamped = await mutateUsers((list) => {
    const u = list.find((x) => x.id === user.id);
    if (!u) throw new AuthError("Usuario o contraseña incorrectos.");
    u.lastLoginAt = new Date().toISOString();
    return u;
  });
  await issueSession(stamped);
  return toPublic(stamped);
}

export function logout() {
  deleteCookie(COOKIE, { path: "/" });
}
