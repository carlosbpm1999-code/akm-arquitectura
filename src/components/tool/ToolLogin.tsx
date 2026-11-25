import { useState, type FormEvent } from "react";
import wordmark from "@/assets/brand/akm-wordmark-light.svg";
import { toolLogin } from "@/lib/server-fns";

export function ToolLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await toolLogin({ data: { username, password } });
      if (res.ok) onLogin();
      else setError(res.error);
    } catch {
      setError("No se ha podido conectar con el servidor.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="tl tl-login">
      <form className="tl-login-card" onSubmit={submit}>
        <img src={wordmark} alt="AKM Arquitectura" className="tl-login-logo" />
        <h1>Panel de administración</h1>
        <p className="tl-login-sub">Acceso restringido al equipo de AKM.</p>

        <div className="tl-field">
          <label htmlFor="tl-user">Usuario</label>
          <input
            id="tl-user"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="tl-field">
          <label htmlFor="tl-pass">Contraseña</label>
          <div className="tl-pass">
            <input
              id="tl-pass"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="tl-pass-toggle">
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

        {error && (
          <p className="tl-notice tl-notice--error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="tl-btn tl-btn--primary tl-btn--block" disabled={busy}>
          {busy ? "Entrando…" : "Entrar"}
        </button>
        <a href="/" className="tl-login-back">← Volver a la web</a>
      </form>
    </main>
  );
}
