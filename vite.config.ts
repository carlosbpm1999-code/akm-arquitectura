// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import path from "node:path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { imagetools } from "vite-imagetools";

export default defineConfig(({ command }) => ({
  plugins: [imagetools()],
  // El plugin de Cloudflare solo actúa al compilar. En `npm run dev` (Node) el módulo
  // `cloudflare:workers` no existe: se sustituye por un KV local en .wrangler/akm-kv/.
  ...(command === "serve" && {
    resolve: {
      alias: { "cloudflare:workers": path.resolve(process.cwd(), "src/server/cloudflare-dev.ts") },
    },
  }),
}));
