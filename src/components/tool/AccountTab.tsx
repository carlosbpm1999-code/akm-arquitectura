import { useState, type FormEvent } from "react";
import { toolChangeOwnPassword } from "@/lib/server-fns";
import type { ToolApi } from "./ToolPanel";
import { NoticeBar, Section, formatDate, useNotice } from "./ui";

export function AccountTab({ api }: { api: ToolApi }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useNotice();

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (next !== repeat) return setNotice({ kind: "error", text: "Las contraseñas nuevas no coinciden." });
    setBusy(true);
    const res = await api.call(() => toolChangeOwnPassword({ data: { current, next } }));
    setBusy(false);
    if (!res.ok) return setNotice({ kind: "error", text: res.error });
    setCurrent("");
    setNext("");
    setRepeat("");
    setNotice({ kind: "ok", text: "Contraseña cambiada. Se han cerrado tus sesiones en otros dispositivos." });
  }

  return (
    <div className="tl-account">
      <header className="tl-editor-head">
        <div>
          <p className="tl-eyebrow">{api.user.role === "admin" ? "Administrador" : "Editor"}</p>
          <h2>{api.user.username}</h2>
          <p className="tl-hint">Último acceso: {formatDate(api.user.lastLoginAt)}</p>
        </div>
      </header>
      <NoticeBar notice={notice} />

      <Section title="Cambiar contraseña">
        <form className="tl-form-narrow" onSubmit={submit}>
          <input type="text" name="username" autoComplete="username" value={api.user.username} readOnly hidden />
          <div className="tl-field">
            <label htmlFor="ac-cur">Contraseña actual</label>
            <input id="ac-cur" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
          </div>
          <div className="tl-field">
            <label htmlFor="ac-new">Nueva contraseña</label>
            <input id="ac-new" type="password" autoComplete="new-password" minLength={6} value={next} onChange={(e) => setNext(e.target.value)} required />
          </div>
          <div className="tl-field">
            <label htmlFor="ac-rep">Repite la nueva contraseña</label>
            <input id="ac-rep" type="password" autoComplete="new-password" minLength={6} value={repeat} onChange={(e) => setRepeat(e.target.value)} required />
          </div>
          <button type="submit" className="tl-btn tl-btn--primary" disabled={busy}>
            {busy ? "Guardando…" : "Cambiar contraseña"}
          </button>
        </form>
      </Section>
    </div>
  );
}
