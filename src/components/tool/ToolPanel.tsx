import { useCallback, useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import wordmark from "@/assets/brand/akm-wordmark-light.svg";
import { toolGetConfig, toolLogout, type Result } from "@/lib/server-fns";
import type { SiteConfig } from "@/lib/site-config";
import type { PublicUser } from "@/server/auth";
import { ProjectsTab } from "./ProjectsTab";
import { HomeTab } from "./HomeTab";
import { UsersTab } from "./UsersTab";
import { AccountTab } from "./AccountTab";
import { formatDate } from "./ui";

type Tab = "proyectos" | "portada" | "usuarios" | "cuenta";

/** Lo que necesitan las pestañas para hablar con el servidor. */
export type ToolApi = {
  user: PublicUser;
  config: SiteConfig;
  /** Ejecuta una llamada al servidor; si la sesión ha caducado vuelve al login. */
  call: <T>(fn: () => Promise<Result<T>>) => Promise<Result<T>>;
  /** Guarda la nueva configuración devuelta por el servidor y refresca la web. */
  applyConfig: (config: SiteConfig) => void;
  /** Avisa de cambios sin guardar para pedir confirmación al cambiar de pestaña. */
  setDirty: (dirty: boolean) => void;
};

export function ToolPanel({ user, onSessionChange }: { user: PublicUser; onSessionChange: () => void }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("proyectos");
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const call = useCallback(
    async <T,>(fn: () => Promise<Result<T>>): Promise<Result<T>> => {
      try {
        const res = await fn();
        if (!res.ok && res.expired) onSessionChange();
        return res;
      } catch {
        return { ok: false, error: "No se ha podido conectar con el servidor." };
      }
    },
    [onSessionChange],
  );

  useEffect(() => {
    call(() => toolGetConfig()).then((res) => {
      if (res.ok) setConfig(res.data);
      else setLoadError(res.error);
    });
  }, [call]);

  // Avisar antes de cerrar la pestaña del navegador con cambios pendientes
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const applyConfig = useCallback(
    (next: SiteConfig) => {
      setConfig(next);
      router.invalidate(); // la web pública recoge los cambios al navegar
    },
    [router],
  );

  const confirmLeave = () => !dirty || window.confirm("Tienes cambios sin guardar. ¿Quieres descartarlos?");

  function changeTab(next: Tab) {
    if (next === tab || !confirmLeave()) return;
    setDirty(false);
    setTab(next);
  }

  async function logout() {
    if (!confirmLeave()) return;
    await toolLogout().catch(() => {});
    onSessionChange();
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "proyectos", label: "Proyectos" },
    { id: "portada", label: "Portada" },
    ...(user.role === "admin" ? [{ id: "usuarios" as const, label: "Usuarios" }] : []),
    { id: "cuenta", label: "Mi cuenta" },
  ];

  const api: ToolApi | null = config ? { user, config, call, applyConfig, setDirty } : null;

  return (
    <div className="tl">
      <header className="tl-top">
        <div className="tl-top-brand">
          <img src={wordmark} alt="AKM Arquitectura" />
          <span>Panel</span>
        </div>
        <nav className="tl-tabs" aria-label="Secciones del panel">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={"tl-tab" + (t.id === tab ? " is-active" : "")}
              aria-current={t.id === tab ? "page" : undefined}
              onClick={() => changeTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="tl-top-user">
          <a href="/" target="_blank" rel="noreferrer" className="tl-top-link">
            Ver web ↗
          </a>
          <span className="tl-user-chip" title={user.role === "admin" ? "Administrador" : "Editor"}>
            {user.username}
            <small>{user.role === "admin" ? "Admin" : "Editor"}</small>
          </span>
          <button type="button" className="tl-top-link" onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      <main className="tl-main">
        {!api ? (
          <p className={loadError ? "tl-notice tl-notice--error" : "tl-loading"}>{loadError ?? "Cargando…"}</p>
        ) : (
          <>
            {tab === "proyectos" && <ProjectsTab api={api} />}
            {tab === "portada" && <HomeTab api={api} />}
            {tab === "usuarios" && user.role === "admin" && <UsersTab api={api} />}
            {tab === "cuenta" && <AccountTab api={api} />}
          </>
        )}
      </main>

      {config?.updatedAt && (
        <footer className="tl-foot">
          Último cambio: {formatDate(config.updatedAt)}
          {config.updatedBy ? ` · ${config.updatedBy}` : ""}
        </footer>
      )}
    </div>
  );
}
