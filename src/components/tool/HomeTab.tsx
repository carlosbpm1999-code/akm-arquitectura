import { useEffect, useMemo, useState } from "react";
import { CoverImage } from "@/components/CoverImage";
import { buildProjects, type Project } from "@/data/projects";
import { toolSaveHome } from "@/lib/server-fns";
import { DEFAULT_CONFIG, LIMITS, type ProjectKey } from "@/lib/site-config";
import type { ToolApi } from "./ToolPanel";
import { NoticeBar, Section, useNotice } from "./ui";

export function HomeTab({ api }: { api: ToolApi }) {
  const [hero, setHero] = useState<ProjectKey[]>(api.config.hero);
  const [featured, setFeatured] = useState<ProjectKey[]>(api.config.featured);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useNotice();

  const projects = useMemo(() => buildProjects(api.config), [api.config]);
  const dirty =
    JSON.stringify(hero) !== JSON.stringify(api.config.hero) ||
    JSON.stringify(featured) !== JSON.stringify(api.config.featured);

  const { setDirty } = api;
  useEffect(() => setDirty(dirty), [dirty, setDirty]);
  useEffect(() => () => setDirty(false), [setDirty]);

  async function save() {
    setBusy(true);
    const res = await api.call(() => toolSaveHome({ data: { hero, featured } }));
    setBusy(false);
    if (!res.ok) return setNotice({ kind: "error", text: res.error });
    api.applyConfig(res.data);
    setHero(res.data.hero);
    setFeatured(res.data.featured);
    setNotice({ kind: "ok", text: "Portada actualizada. Ya se ve en la web." });
  }

  function restoreDefaults() {
    if (!window.confirm("¿Volver a la selección original de la portada? Tendrás que guardar para aplicarla.")) return;
    setHero(DEFAULT_CONFIG.hero);
    setFeatured(DEFAULT_CONFIG.featured);
  }

  return (
    <div className="tl-home">
      <header className="tl-editor-head">
        <div>
          <p className="tl-eyebrow">Landing principal</p>
          <h2>Portada</h2>
          <a href="/" target="_blank" rel="noreferrer" className="tl-link">
            Ver la portada ↗
          </a>
        </div>
        <div className="tl-editor-actions">
          <button type="button" className="tl-btn tl-btn--ghost" onClick={restoreDefaults} disabled={busy}>
            Selección original
          </button>
          <button
            type="button"
            className="tl-btn"
            onClick={() => {
              setHero(api.config.hero);
              setFeatured(api.config.featured);
            }}
            disabled={busy || !dirty}
          >
            Descartar
          </button>
          <button type="button" className="tl-btn tl-btn--primary" onClick={save} disabled={busy || !dirty}>
            {busy ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </header>
      <NoticeBar notice={notice} />
      {dirty && !notice && <p className="tl-dirty">Cambios sin guardar</p>}

      <KeyList
        title="Carrusel de cabecera"
        description="Fotos que van pasando junto al titular «Arquitectura que perdura»."
        max={LIMITS.hero}
        keys={hero}
        onChange={setHero}
        all={projects.all}
      />

      <KeyList
        title="Proyectos seleccionados"
        description="Rejilla bajo «Sobre el estudio». El diseño está pensado para 9 proyectos: el 1.º ocupa el bloque grande y el 2.º el vertical. Con menos de 9 quedarán huecos."
        max={LIMITS.featured}
        keys={featured}
        onChange={setFeatured}
        all={projects.all}
        warnBelow={LIMITS.featured}
      />
    </div>
  );
}

function KeyList({
  title,
  description,
  max,
  keys,
  onChange,
  all,
  warnBelow,
}: {
  title: string;
  description: string;
  max: number;
  keys: ProjectKey[];
  onChange: (keys: ProjectKey[]) => void;
  all: Project[];
  warnBelow?: number;
}) {
  const [toAdd, setToAdd] = useState("");
  const byKey = useMemo(() => new Map(all.map((p) => [p.key, p])), [all]);
  const items = keys.map((k) => byKey.get(k)).filter((p): p is Project => !!p);
  const available = all.filter((p) => !keys.includes(p.key));

  const move = (i: number, d: -1 | 1) => {
    const next = [...keys];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };

  function add() {
    if (!toAdd || keys.length >= max) return;
    onChange([...keys, toAdd]);
    setToAdd("");
  }

  return (
    <Section
      title={title}
      aside={
        <span className={"tl-count" + (keys.length >= max ? " is-full" : "")}>
          {keys.length} / {max}
        </span>
      }
    >
      <p className="tl-hint tl-hint--top">{description}</p>
      {warnBelow && keys.length > 0 && keys.length < warnBelow && (
        <p className="tl-notice tl-notice--warn">
          Hay {keys.length} de {warnBelow}: la rejilla de la portada mostrará huecos.
        </p>
      )}
      <ol className="tl-klist">
        {items.map((p, i) => (
          <li key={p.key} className="tl-kitem">
            <span className="tl-kidx">{String(i + 1).padStart(2, "0")}</span>
            <span className="tl-thumb">
              <CoverImage src={p.cover} alt="" look={p.look} loading="lazy" />
            </span>
            <span className="tl-prow-text">
              <strong>{p.card.name}</strong>
              <small>{p.card.cat}</small>
            </span>
            <span className="tl-kactions">
              <button type="button" className="tl-icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Subir ${p.card.name}`} title="Subir">
                ↑
              </button>
              <button type="button" className="tl-icon" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Bajar ${p.card.name}`} title="Bajar">
                ↓
              </button>
              <button
                type="button"
                className="tl-icon tl-icon--danger"
                onClick={() => onChange(keys.filter((k) => k !== p.key))}
                aria-label={`Quitar ${p.card.name}`}
                title="Quitar"
              >
                ×
              </button>
            </span>
          </li>
        ))}
        {!items.length && <li className="tl-empty">No hay proyectos. Añade alguno.</li>}
      </ol>
      <div className="tl-add">
        <select value={toAdd} onChange={(e) => setToAdd(e.target.value)} disabled={keys.length >= max} aria-label={`Añadir proyecto a ${title}`}>
          <option value="">{keys.length >= max ? `Máximo ${max} proyectos` : "Elegir proyecto para añadir…"}</option>
          <optgroup label="Hoteles">
            {available.filter((p) => p.section === "hoteles").map((p) => (
              <option key={p.key} value={p.key}>{p.card.name}</option>
            ))}
          </optgroup>
          <optgroup label="Residencial">
            {available.filter((p) => p.section === "residencial").map((p) => (
              <option key={p.key} value={p.key}>{p.card.name}</option>
            ))}
          </optgroup>
        </select>
        <button type="button" className="tl-btn" onClick={add} disabled={!toAdd || keys.length >= max}>
          Añadir
        </button>
      </div>
    </Section>
  );
}
