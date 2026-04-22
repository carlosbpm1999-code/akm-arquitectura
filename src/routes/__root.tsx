import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AKM Kassem & Molinero Arquitectura" },
      { name: "description", content: "Estudio de arquitectura en Barcelona desde 1980. Rehabilitación, obra nueva, hoteles y patrimonio." },
      { name: "author", content: "AKM Arquitectura" },
      { property: "og:title", content: "AKM Kassem & Molinero Arquitectura" },
      { property: "og:description", content: "Estudio de arquitectura en Barcelona desde 1980. Rehabilitación, obra nueva, hoteles y patrimonio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "AKM Kassem & Molinero Arquitectura" },
      { name: "twitter:description", content: "Estudio de arquitectura en Barcelona desde 1980. Rehabilitación, obra nueva, hoteles y patrimonio." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/93096cb4-dcd1-40ff-bb24-0a2f51db11cc/id-preview-3ec9aa93--3596915f-d4f7-4159-a8eb-e93ae17aea7e.lovable.app-1776847429365.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/93096cb4-dcd1-40ff-bb24-0a2f51db11cc/id-preview-3ec9aa93--3596915f-d4f7-4159-a8eb-e93ae17aea7e.lovable.app-1776847429365.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
