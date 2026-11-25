import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toolGetSession } from "@/lib/server-fns";
import { ToolLogin } from "@/components/tool/ToolLogin";
import { ToolPanel } from "@/components/tool/ToolPanel";

// Panel de administración. No aparece en la navegación y los buscadores no lo indexan.
export const Route = createFileRoute("/tool")({
  head: () => ({
    meta: [
      { title: "Panel de administración — AKM" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: () => toolGetSession(),
  component: ToolPage,
});

function ToolPage() {
  const { user } = Route.useLoaderData();
  const router = useRouter();
  // Tras entrar, salir o caducar la sesión se vuelve a pedir el estado al servidor
  const refresh = () => router.invalidate();

  return user ? <ToolPanel user={user} onSessionChange={refresh} /> : <ToolLogin onLogin={refresh} />;
}
