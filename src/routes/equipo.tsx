import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/equipo")({
  component: () => <Outlet />,
});
