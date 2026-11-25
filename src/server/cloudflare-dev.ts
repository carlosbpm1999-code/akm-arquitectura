// SOLO DESARROLLO. Sustituye a `cloudflare:workers` cuando se ejecuta `npm run dev`
// en Node (ver vite.config.ts). Imita el binding AKM_KV guardando cada clave como un
// archivo en .wrangler/akm-kv/, carpeta que ya está en .gitignore.
import { promises as fs } from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), ".wrangler", "akm-kv");
const file = (key: string) => path.join(DIR, encodeURIComponent(key));

const AKM_KV = {
  async get(key: string): Promise<string | null> {
    try {
      return await fs.readFile(file(key), "utf8");
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw err;
    }
  },
  async put(key: string, value: string): Promise<void> {
    await fs.mkdir(DIR, { recursive: true });
    const tmp = `${file(key)}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmp, value, "utf8");
    await fs.rename(tmp, file(key));
  },
  async delete(key: string): Promise<void> {
    await fs.rm(file(key), { force: true });
  },
};

export const env = {
  AKM_KV,
  AKM_SESSION_SECRET: process.env.AKM_SESSION_SECRET,
  AKM_PBKDF2_ITERATIONS: process.env.AKM_PBKDF2_ITERATIONS,
};
