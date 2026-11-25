// Tipos mínimos del módulo del Worker que usa el panel /tool (src/server/kv.ts).
declare module "cloudflare:workers" {
  interface AkmKVNamespace {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
  }
  export const env: {
    AKM_KV?: AkmKVNamespace;
    AKM_SESSION_SECRET?: string;
    AKM_PBKDF2_ITERATIONS?: string;
  };
}
