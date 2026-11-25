import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  AuthError,
  SessionError,
  changeOwnPassword,
  createUser,
  deleteUser,
  getSessionUser,
  listUsers,
  login,
  logout,
  requireUser,
  updateUser,
} from "@/server/auth";
import { KEYS, StorageError, readJson, withLock, writeJson } from "@/server/kv";
import {
  DEFAULT_CONFIG,
  LIMITS,
  isProjectKey,
  sanitizeConfig,
  sanitizeKeyList,
  sanitizeOverride,
  type SiteConfig,
} from "@/lib/site-config";
import { baseProjectByKey } from "@/data/projects";

/** Solo claves de proyectos que existen de verdad. */
const existingKeys = (keys: string[], max: number) =>
  sanitizeKeyList(keys, Infinity).filter((k) => baseProjectByKey.has(k)).slice(0, max);

// Los errores esperados (contraseña incorrecta, permisos…) se devuelven como datos
// para que el panel muestre el mensaje tal cual.
export type Result<T> = { ok: true; data: T } | { ok: false; error: string; expired?: boolean };

async function run<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (err) {
    if (err instanceof SessionError) return { ok: false, error: err.message, expired: true };
    if (err instanceof AuthError) return { ok: false, error: err.message };
    if (err instanceof z.ZodError) return { ok: false, error: "Datos no válidos." };
    if (err instanceof StorageError) {
      console.error("[tool]", err.message);
      return { ok: false, error: "El almacenamiento de Cloudflare (KV) no está configurado. Avisa a quien mantiene la web." };
    }
    console.error("[tool]", err);
    return { ok: false, error: "Error inesperado en el servidor. Inténtalo de nuevo." };
  }
}

// ── Ajustes de la web ────────────────────────────────────────────────────────

async function readConfig(): Promise<SiteConfig> {
  const raw = await readJson<unknown>(KEYS.config);
  return raw === undefined ? structuredClone(DEFAULT_CONFIG) : sanitizeConfig(raw);
}

/** Para la web pública: si KV falla, se muestra la web con los valores por defecto. */
async function loadConfig(): Promise<SiteConfig> {
  try {
    return await readConfig();
  } catch (err) {
    console.error("[site-config] No se pudo leer de KV:", err instanceof Error ? err.message : err);
    return structuredClone(DEFAULT_CONFIG);
  }
}

// El panel lee y escribe sin red de seguridad: así un fallo de KV se ve como error
// en vez de guardar encima de los ajustes reales una copia de los valores por defecto.
function mutateConfig(username: string, fn: (c: SiteConfig) => void) {
  return withLock(KEYS.config, async () => {
    const config = await readConfig();
    fn(config);
    config.updatedAt = new Date().toISOString();
    config.updatedBy = username;
    await writeJson(KEYS.config, config);
    return config;
  });
}

/** Público: lo usa toda la web para pintar portadas, textos y destacados. */
export const getSiteConfig = createServerFn({ method: "GET" }).handler(() => loadConfig());

// ── Sesión ───────────────────────────────────────────────────────────────────

export const toolGetSession = createServerFn({ method: "GET" }).handler(async () => ({
  user: await getSessionUser(),
}));

export const toolLogin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ username: z.string().max(64), password: z.string().max(200) }).parse(d))
  .handler(({ data }) => run(() => login(data.username, data.password)));

export const toolLogout = createServerFn({ method: "POST" }).handler(async () => {
  logout();
  return { ok: true as const };
});

// ── Proyectos y portada ──────────────────────────────────────────────────────

export const toolGetConfig = createServerFn({ method: "GET" }).handler(() =>
  run(async () => {
    await requireUser();
    return readConfig();
  }),
);

export const toolSaveProject = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({ key: z.string().refine((k) => isProjectKey(k) && baseProjectByKey.has(k)), override: z.unknown().nullable() })
      .parse(d),
  )
  .handler(({ data }) =>
    run(async () => {
      const user = await requireUser();
      return mutateConfig(user.username, (c) => {
        const o = data.override === null ? undefined : sanitizeOverride(data.override);
        if (o) c.projects[data.key] = o;
        else delete c.projects[data.key];
      });
    }),
  );

export const toolSaveHome = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ hero: z.array(z.string()), featured: z.array(z.string()) }).parse(d))
  .handler(({ data }) =>
    run(async () => {
      const user = await requireUser();
      return mutateConfig(user.username, (c) => {
        c.hero = existingKeys(data.hero, LIMITS.hero);
        c.featured = existingKeys(data.featured, LIMITS.featured);
      });
    }),
  );

// ── Usuarios ─────────────────────────────────────────────────────────────────

const role = z.enum(["admin", "editor"]);

export const toolListUsers = createServerFn({ method: "GET" }).handler(() =>
  run(async () => {
    await requireUser("admin");
    return listUsers();
  }),
);

export const toolCreateUser = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ username: z.string().max(64), password: z.string().max(200), role }).parse(d),
  )
  .handler(({ data }) =>
    run(async () => {
      await requireUser("admin");
      return createUser(data);
    }),
  );

export const toolUpdateUser = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().max(64), role: role.optional(), password: z.string().max(200).optional() }).parse(d),
  )
  .handler(({ data }) =>
    run(async () => {
      const actor = await requireUser("admin");
      return updateUser(actor.id, data.id, { role: data.role, password: data.password });
    }),
  );

export const toolDeleteUser = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().max(64) }).parse(d))
  .handler(({ data }) =>
    run(async () => {
      const actor = await requireUser("admin");
      await deleteUser(actor.id, data.id);
      return true;
    }),
  );

export const toolChangeOwnPassword = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ current: z.string().max(200), next: z.string().max(200) }).parse(d))
  .handler(({ data }) =>
    run(async () => {
      const user = await requireUser();
      await changeOwnPassword(user.id, data.current, data.next);
      return true;
    }),
  );
