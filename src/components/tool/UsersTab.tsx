import { useEffect, useState, type FormEvent } from "react";
import { toolCreateUser, toolDeleteUser, toolListUsers, toolUpdateUser } from "@/lib/server-fns";
import type { PublicUser, Role } from "@/server/auth";
import type { ToolApi } from "./ToolPanel";
import { NoticeBar, Section, formatDate, useNotice } from "./ui";

const ROLE_LABEL: Record<Role, string> = { admin: "Administrador", editor: "Editor" };

/** Contraseña aleatoria legible (sin caracteres que se confundan). */
function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint32Array(12));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export function UsersTab({ api }: { api: ToolApi }) {
  const [users, setUsers] = useState<PublicUser[] | null>(null);
  const [notice, setNotice] = useNotice();
  const { call } = api;

  async function reload() {
    const res = await call(() => toolListUsers());
    if (res.ok) setUsers(res.data);
    else setNotice({ kind: "error", text: res.error });
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tl-users">
      <header className="tl-editor-head">
        <div>
          <p className="tl-eyebrow">Acceso al panel</p>
          <h2>Usuarios</h2>
        </div>
      </header>
      <NoticeBar notice={notice} />

      <Section title="Roles">
        <ul className="tl-roles">
          <li><strong>Administrador</strong> — edita proyectos y portada, y gestiona usuarios.</li>
          <li><strong>Editor</strong> — edita proyectos y portada. No ve esta sección.</li>
        </ul>
      </Section>

      <NewUser api={api} onCreated={(u) => { setNotice({ kind: "ok", text: `Usuario «${u.username}» creado.` }); reload(); }} />

      <Section title="Usuarios con acceso" aside={users && <span className="tl-count">{users.length}</span>}>
        {!users ? (
          <p className="tl-loading">Cargando…</p>
        ) : (
          <ul className="tl-ulist">
            {users.map((u) => (
              <UserRow
                key={u.id}
                user={u}
                api={api}
                isSelf={u.id === api.user.id}
                onChanged={(text) => { setNotice({ kind: "ok", text }); reload(); }}
                onError={(text) => setNotice({ kind: "error", text })}
              />
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function NewUser({ api, onCreated }: { api: ToolApi; onCreated: (u: PublicUser) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await api.call(() => toolCreateUser({ data: { username, password, role } }));
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setUsername("");
    setPassword("");
    setRole("editor");
    onCreated(res.data);
  }

  return (
    <Section title="Nuevo usuario">
      <form className="tl-newuser" onSubmit={submit}>
        <div className="tl-field">
          <label htmlFor="nu-name">Usuario</label>
          <input id="nu-name" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off" required minLength={3} maxLength={32} />
        </div>
        <div className="tl-field">
          <label htmlFor="nu-pass">Contraseña</label>
          <div className="tl-pass">
            <input id="nu-pass" type="text" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required minLength={6} />
            <button type="button" className="tl-pass-toggle" onClick={() => setPassword(generatePassword())}>
              Generar
            </button>
          </div>
        </div>
        <div className="tl-field">
          <label htmlFor="nu-role">Rol</label>
          <select id="nu-role" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="editor">Editor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button type="submit" className="tl-btn tl-btn--primary" disabled={busy}>
          {busy ? "Creando…" : "Crear usuario"}
        </button>
      </form>
      {error && <p className="tl-notice tl-notice--error" role="alert">{error}</p>}
      <p className="tl-hint">Copia la contraseña antes de crear el usuario: después no se puede ver, solo cambiar.</p>
    </Section>
  );
}

function UserRow({
  user,
  api,
  isSelf,
  onChanged,
  onError,
}: {
  user: PublicUser;
  api: ToolApi;
  isSelf: boolean;
  onChanged: (text: string) => void;
  onError: (text: string) => void;
}) {
  const [editingPassword, setEditingPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function changeRole(role: Role) {
    if (!window.confirm(`¿Cambiar el rol de «${user.username}» a ${ROLE_LABEL[role]}?`)) return;
    setBusy(true);
    const res = await api.call(() => toolUpdateUser({ data: { id: user.id, role } }));
    setBusy(false);
    if (res.ok) onChanged(`«${user.username}» ahora es ${ROLE_LABEL[role]}.`);
    else onError(res.error);
  }

  async function savePassword(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await api.call(() => toolUpdateUser({ data: { id: user.id, password } }));
    setBusy(false);
    if (!res.ok) return onError(res.error);
    setEditingPassword(false);
    setPassword("");
    onChanged(`Contraseña de «${user.username}» cambiada. Sus sesiones abiertas se han cerrado.`);
  }

  async function remove() {
    if (!window.confirm(`¿Eliminar el usuario «${user.username}»? Perderá el acceso al panel.`)) return;
    setBusy(true);
    const res = await api.call(() => toolDeleteUser({ data: { id: user.id } }));
    setBusy(false);
    if (res.ok) onChanged(`Usuario «${user.username}» eliminado.`);
    else onError(res.error);
  }

  return (
    <li className="tl-urow">
      <div className="tl-urow-main">
        <span className="tl-avatar" aria-hidden="true">{user.username.slice(0, 2).toUpperCase()}</span>
        <div className="tl-urow-text">
          <strong>
            {user.username} {isSelf && <span className="tl-tag">Tú</span>}
          </strong>
          <small>Último acceso: {formatDate(user.lastLoginAt)} · Creado: {formatDate(user.createdAt)}</small>
        </div>
        <select
          value={user.role}
          onChange={(e) => changeRole(e.target.value as Role)}
          disabled={busy || isSelf}
          aria-label={`Rol de ${user.username}`}
          title={isSelf ? "No puedes cambiar tu propio rol" : undefined}
        >
          <option value="admin">Administrador</option>
          <option value="editor">Editor</option>
        </select>
        <div className="tl-urow-actions">
          {!isSelf && (
            <button type="button" className="tl-btn tl-btn--small" onClick={() => setEditingPassword((v) => !v)} disabled={busy}>
              {editingPassword ? "Cancelar" : "Cambiar contraseña"}
            </button>
          )}
          {!isSelf && (
            <button type="button" className="tl-btn tl-btn--small tl-btn--danger" onClick={remove} disabled={busy}>
              Eliminar
            </button>
          )}
          {isSelf && <span className="tl-hint">Tu contraseña se cambia en «Mi cuenta».</span>}
        </div>
      </div>
      {editingPassword && (
        <form className="tl-urow-pass" onSubmit={savePassword}>
          <div className="tl-pass">
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nueva contraseña"
              autoComplete="new-password"
              minLength={6}
              required
              aria-label={`Nueva contraseña para ${user.username}`}
            />
            <button type="button" className="tl-pass-toggle" onClick={() => setPassword(generatePassword())}>
              Generar
            </button>
          </div>
          <button type="submit" className="tl-btn tl-btn--primary tl-btn--small" disabled={busy}>
            Guardar contraseña
          </button>
        </form>
      )}
    </li>
  );
}
