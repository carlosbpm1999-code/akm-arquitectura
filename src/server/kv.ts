// SOLO SERVIDOR. Almacenamiento del panel /tool en Cloudflare KV.
// Se importa únicamente desde los handlers de createServerFn, así que el compilador
// de TanStack Start lo deja fuera del bundle del navegador.
//
// En producción `cloudflare:workers` es el módulo real del Worker (binding AKM_KV).
// En `npm run dev` (Node) vite.config.ts lo sustituye por src/server/cloudflare-dev.ts,
// un KV de pega que guarda en .wrangler/akm-kv/.
import { env } from "cloudflare:workers";

/** Claves usadas en el namespace. */
export const KEYS = {
  config: "site-config",
  users: "users",
  secret: "session-secret",
} as const;

/** KV no está disponible (binding sin configurar). */
export class StorageError extends Error {}

function kv() {
  const ns = env.AKM_KV;
  if (!ns) {
    throw new StorageError(
      "Falta el binding AKM_KV: revisa kv_namespaces en wrangler.jsonc y vuelve a desplegar.",
    );
  }
  return ns;
}

export async function readJson<T>(key: string): Promise<T | undefined> {
  const text = await kv().get(key);
  return text == null ? undefined : (JSON.parse(text) as T);
}

export async function writeJson(key: string, data: unknown) {
  await kv().put(key, JSON.stringify(data));
}

export async function readText(key: string) {
  return (await kv().get(key)) ?? undefined;
}

export async function writeText(key: string, text: string) {
  await kv().put(key, text);
}

/** Variable de entorno o secreto del Worker (`wrangler secret put …`). */
export function getVar(name: "AKM_SESSION_SECRET" | "AKM_PBKDF2_ITERATIONS"): string | undefined {
  const v = env[name];
  return typeof v === "string" && v ? v : undefined;
}

// Cola por clave dentro de esta instancia: dos guardados simultáneos no se pisan
// (leer → modificar → escribir). KV no tiene transacciones entre instancias, pero con
// un equipo pequeño editando a la vez es más que suficiente.
const queues = new Map<string, Promise<unknown>>();
export function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = queues.get(key) ?? Promise.resolve();
  const next = prev.catch(() => {}).then(fn);
  queues.set(key, next);
  return next;
}
