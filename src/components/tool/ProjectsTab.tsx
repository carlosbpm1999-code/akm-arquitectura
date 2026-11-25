import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { CoverImage } from "@/components/CoverImage";
import { applyOverride, baseProjects, defaultCard, type BaseProject } from "@/data/projects";
import { toolSaveProject } from "@/lib/server-fns";
import {
  DEFAULT_LOOK,
  LIMITS,
  isNeutralLook,
  resolveLook,
  sanitizeOverride,
  type CardText,
  type Look,
  type ProjectOverride,
  type SiteConfig,
  type TintMode,
} from "@/lib/site-config";
import type { ToolApi } from "./ToolPanel";
import { Field, NoticeBar, Section, Slider, useNotice } from "./ui";

// ── Borrador del formulario ↔ ajustes guardados ──────────────────────────────

type Draft = {
  cover: number;
  look: Look;
  name: string;
  meta: string;
  summary: string;
  card: Required<CardText>;
};

function toDraft(o: ProjectOverride | undefined): Draft {
  return {
    cover: o?.cover ?? 0,
    look: resolveLook(o?.look),
    name: o?.name ?? "",
    meta: o?.meta ?? "",
    summary: o?.summary ?? "",
    card: { name: o?.card?.name ?? "", cat: o?.card?.cat ?? "", overCat: o?.card?.overCat ?? "", loc: o?.card?.loc ?? "" },
  };
}

/** Un campo vacío o igual al valor original no se guarda: así la web usa el texto del proyecto. */
function toOverride(base: BaseProject, d: Draft): ProjectOverride | undefined {
  const keep = (v: string, original: string) => (v.trim() && v.trim() !== original ? v : "");
  const name = keep(d.name, base.name);
  const meta = keep(d.meta, base.meta);
  const def = defaultCard({ section: base.section, name: name || base.name, meta: meta || base.meta });
  return sanitizeOverride({
    cover: d.cover,
    look: d.look,
    name,
    meta,
    summary: keep(d.summary, base.summary),
    card: {
      name: keep(d.card.name, def.name),
      cat: keep(d.card.cat, def.cat),
      overCat: keep(d.card.overCat, def.overCat),
      loc: keep(d.card.loc, def.loc),
    },
  });
}

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

// ── Pestaña ──────────────────────────────────────────────────────────────────

type Filter = "todos" | "hoteles" | "residencial" | "editados";

export function ProjectsTab({ api }: { api: ToolApi }) {
  const [selectedKey, setSelectedKey] = useState(baseProjects[0].key);
  const [filter, setFilter] = useState<Filter>("todos");
  const [query, setQuery] = useState("");
  const dirtyRef = useRef(false);
  const { setDirty } = api;
  const onDirtyChange = useCallback(
    (d: boolean) => {
      dirtyRef.current = d;
      setDirty(d);
    },
    [setDirty],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return baseProjects.filter((p) => {
      if (filter === "editados" ? !api.config.projects[p.key] : filter !== "todos" && p.section !== filter) return false;
      return !q || `${p.name} ${p.meta}`.toLowerCase().includes(q);
    });
  }, [filter, query, api.config.projects]);

  function select(key: string) {
    if (key === selectedKey) return;
    if (dirtyRef.current && !window.confirm("Tienes cambios sin guardar en este proyecto. ¿Quieres descartarlos?")) return;
    setSelectedKey(key);
  }

  const base = baseProjects.find((p) => p.key === selectedKey)!;
  const filters: { id: Filter; label: string }[] = [
    { id: "todos", label: "Todos" },
    { id: "hoteles", label: "Hoteles" },
    { id: "residencial", label: "Residencial" },
    { id: "editados", label: "Editados" },
  ];

  return (
    <div className="tl-projects">
      <aside className="tl-plist">
        <input
          type="search"
          className="tl-search"
          placeholder="Buscar proyecto…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar proyecto"
        />
        <div className="tl-chips" role="group" aria-label="Filtrar">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              className={"tl-chip" + (filter === f.id ? " is-active" : "")}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <ul>
          {visible.map((p) => (
            <li key={p.key}>
              <ProjectRow
                base={p}
                config={api.config}
                active={p.key === selectedKey}
                onClick={() => select(p.key)}
              />
            </li>
          ))}
          {!visible.length && <li className="tl-empty">Ningún proyecto coincide.</li>}
        </ul>
      </aside>

      {/* key: al cambiar de proyecto el editor empieza de cero */}
      <ProjectEditor key={base.key} base={base} api={api} onDirtyChange={onDirtyChange} />
    </div>
  );
}

function ProjectRow({
  base,
  config,
  active,
  onClick,
}: {
  base: BaseProject;
  config: SiteConfig;
  active: boolean;
  onClick: () => void;
}) {
  const p = applyOverride(base, config);
  const tags = [
    config.hero.includes(base.key) && "Carrusel",
    config.featured.includes(base.key) && "Destacado",
    config.projects[base.key] && "Editado",
  ].filter(Boolean) as string[];
  return (
    <button type="button" className={"tl-prow" + (active ? " is-active" : "")} onClick={onClick}>
      <span className="tl-thumb">
        <CoverImage src={p.cover} alt="" look={p.look} loading="lazy" />
      </span>
      <span className="tl-prow-text">
        <strong>{p.card.name}</strong>
        <small>{base.section === "hoteles" ? "Hotel" : "Residencial"} · {p.meta.split(" · ")[0]}</small>
        {tags.length > 0 && (
          <span className="tl-tags">
            {tags.map((t) => (
              <span key={t} className="tl-tag">{t}</span>
            ))}
          </span>
        )}
      </span>
    </button>
  );
}

// ── Editor de un proyecto ────────────────────────────────────────────────────

const FRAMES = [
  { label: "Panorámica 16:9", ratio: "16 / 9", hint: "Destacado grande de la portada, fichas" },
  { label: "Tarjeta 4:3", ratio: "4 / 3", hint: "Rejillas y listados" },
  { label: "Vertical 8:9", ratio: "8 / 9", hint: "Segundo destacado de la portada" },
];

function ProjectEditor({
  base,
  api,
  onDirtyChange,
}: {
  base: BaseProject;
  api: ToolApi;
  onDirtyChange: (dirty: boolean) => void;
}) {
  const saved = api.config.projects[base.key];
  const [draft, setDraft] = useState<Draft>(() => toDraft(saved));
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useNotice();

  const override = toOverride(base, draft);
  const dirty = !same(override, sanitizeOverride(saved));
  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange(false), [onDirtyChange]);

  // Vista previa con los cambios aún sin guardar
  const preview = applyOverride(base, {
    ...api.config,
    projects: { ...api.config.projects, ...(override ? { [base.key]: override } : {}) },
  });
  const defaults = defaultCard({ section: base.section, name: preview.name, meta: preview.meta });

  const setLook = (patch: Partial<Look>) => setDraft((d) => ({ ...d, look: { ...d.look, ...patch } }));
  const setCard = (patch: Partial<CardText>) => setDraft((d) => ({ ...d, card: { ...d.card, ...patch } }));

  async function save(next: ProjectOverride | undefined) {
    setBusy(true);
    const res = await api.call(() => toolSaveProject({ data: { key: base.key, override: next ?? null } }));
    setBusy(false);
    if (!res.ok) return setNotice({ kind: "error", text: res.error });
    api.applyConfig(res.data);
    setDraft(toDraft(res.data.projects[base.key]));
    setNotice({ kind: "ok", text: next ? "Cambios guardados. Ya se ven en la web." : "Proyecto restablecido al original." });
  }

  function resetAll() {
    if (!saved && !dirty) return;
    if (!window.confirm("Se borrarán el encuadre, los ajustes y los textos personalizados de este proyecto. ¿Continuar?")) return;
    save(undefined);
  }

  const href = `/${base.section}/${base.slug}`;

  return (
    <div className="tl-editor">
      <header className="tl-editor-head">
        <div>
          <p className="tl-eyebrow">{base.section === "hoteles" ? "Hotel" : "Residencial"}</p>
          <h2>{preview.name}</h2>
          <a href={href} target="_blank" rel="noreferrer" className="tl-link">
            Ver en la web ↗
          </a>
        </div>
        <div className="tl-editor-actions">
          <button type="button" className="tl-btn tl-btn--ghost" onClick={resetAll} disabled={busy || (!saved && !dirty)}>
            Restablecer original
          </button>
          <button
            type="button"
            className="tl-btn"
            onClick={() => setDraft(toDraft(saved))}
            disabled={busy || !dirty}
          >
            Descartar
          </button>
          <button type="button" className="tl-btn tl-btn--primary" onClick={() => save(override)} disabled={busy || !dirty}>
            {busy ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </header>
      <NoticeBar notice={notice} />
      {dirty && !notice && <p className="tl-dirty">Cambios sin guardar</p>}

      <Section title="Foto de portada" aside={<span className="tl-hint">{base.images.length} fotos</span>}>
        <div className="tl-covers" role="radiogroup" aria-label="Foto de portada">
          {base.images.map((src, i) => (
            <button
              key={src}
              type="button"
              role="radio"
              aria-checked={draft.cover === i}
              aria-label={`Foto ${i + 1}`}
              className={"tl-cover" + (draft.cover === i ? " is-active" : "")}
              onClick={() => setDraft((d) => ({ ...d, cover: i }))}
            >
              <img src={src} alt="" loading="lazy" />
              {i === 0 && <span className="tl-cover-badge">Original</span>}
            </button>
          ))}
        </div>
        <p className="tl-hint">La foto de portada se usa en la landing, los listados y la cabecera de la ficha. El resto forma la galería.</p>
      </Section>

      <Section
        title="Encuadre"
        aside={
          <button
            type="button"
            className="tl-link"
            onClick={() => setLook({ x: 50, y: 50, zoom: 1 })}
            disabled={draft.look.x === 50 && draft.look.y === 50 && draft.look.zoom === 1}
          >
            Centrar
          </button>
        }
      >
        <div className="tl-crop">
          <FocalStage src={preview.cover} look={draft.look} onChange={setLook} />
          <div className="tl-crop-side">
            <Slider
              label="Zoom"
              value={draft.look.zoom}
              min={LIMITS.zoom[0]}
              max={LIMITS.zoom[1]}
              step={0.01}
              neutral={1}
              format={(v) => `${Math.round(v * 100)}%`}
              onChange={(zoom) => setLook({ zoom })}
            />
            <p className="tl-hint">
              Arrastra el punto sobre la foto para elegir qué parte queda siempre visible al recortarla. También con las flechas del teclado.
            </p>
          </div>
        </div>
        <div className="tl-frames">
          {FRAMES.map((f) => (
            <figure key={f.ratio} className="tl-frame-wrap">
              <div className="tl-frame" style={{ aspectRatio: f.ratio }}>
                <CoverImage src={preview.cover} alt="" look={draft.look} />
                <div className="tl-frame-label">
                  <span>{preview.card.cat}</span>
                  <strong>{preview.card.name}</strong>
                </div>
              </div>
              <figcaption>
                {f.label} <small>{f.hint}</small>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section
        title="Ajustes de imagen"
        aside={
          <button
            type="button"
            className="tl-link"
            onClick={() => setLook({ ...DEFAULT_LOOK, x: draft.look.x, y: draft.look.y, zoom: draft.look.zoom })}
            disabled={isNeutralLook({ ...draft.look, x: 50, y: 50, zoom: 1 })}
          >
            Quitar ajustes
          </button>
        }
      >
        <div className="tl-grid2">
          <Slider label="Desenfoque" value={draft.look.blur} min={LIMITS.blur[0]} max={LIMITS.blur[1]} step={0.5} neutral={0} unit=" px" onChange={(blur) => setLook({ blur })} />
          <Slider label="Brillo" value={draft.look.brightness} min={LIMITS.brightness[0]} max={LIMITS.brightness[1]} neutral={100} unit="%" onChange={(brightness) => setLook({ brightness })} />
          <Slider label="Contraste" value={draft.look.contrast} min={LIMITS.contrast[0]} max={LIMITS.contrast[1]} neutral={100} unit="%" onChange={(contrast) => setLook({ contrast })} />
          <Slider label="Saturación" value={draft.look.saturation} min={LIMITS.saturation[0]} max={LIMITS.saturation[1]} neutral={100} unit="%" onChange={(saturation) => setLook({ saturation })} />
        </div>
        <div className="tl-color">
          <div className="tl-field tl-field--inline">
            <label htmlFor="tl-tint">Color</label>
            <input id="tl-tint" type="color" value={draft.look.tint} onChange={(e) => setLook({ tint: e.target.value })} />
            <div className="tl-swatches">
              {[
                ["#07262e", "Tinta AKM"],
                ["#6c826a", "Verde AKM"],
                ["#d6d193", "Oro AKM"],
                ["#c98a4b", "Cálido"],
                ["#3d6fa8", "Frío"],
              ].map(([c, name]) => (
                <button
                  key={c}
                  type="button"
                  className={"tl-swatch" + (draft.look.tint === c ? " is-active" : "")}
                  style={{ background: c }}
                  title={name}
                  aria-label={name}
                  onClick={() => setLook({ tint: c, tintAmount: draft.look.tintAmount || 25 })}
                />
              ))}
            </div>
          </div>
          <Slider label="Intensidad del color" value={draft.look.tintAmount} min={0} max={100} neutral={0} unit="%" onChange={(tintAmount) => setLook({ tintAmount })} />
          <div className="tl-field tl-field--inline">
            <label htmlFor="tl-tint-mode">Mezcla</label>
            <select
              id="tl-tint-mode"
              value={draft.look.tintMode}
              onChange={(e) => setLook({ tintMode: e.target.value as TintMode })}
            >
              <option value="color">Tono (colorea la foto)</option>
              <option value="soft-light">Luz suave (sutil)</option>
              <option value="multiply">Multiplicar (oscurece)</option>
            </select>
          </div>
        </div>
      </Section>

      <Section title="Textos y datos">
        <p className="tl-hint tl-hint--top">Deja un campo vacío para usar el texto original (aparece en gris).</p>
        <div className="tl-grid2">
          <Field label="Nombre del proyecto" value={draft.name} placeholder={base.name} maxLength={LIMITS.text.name} onChange={(name) => setDraft((d) => ({ ...d, name }))} />
          <Field
            label="Datos"
            hint="Formato: Ciudad · Año · Superficie. Se usa en la ficha y en los listados."
            value={draft.meta}
            placeholder={base.meta}
            maxLength={LIMITS.text.meta}
            onChange={(meta) => setDraft((d) => ({ ...d, meta }))}
          />
        </div>
        <Field
          label="Resumen"
          hint="Texto para buscadores y redes sociales."
          multiline
          value={draft.summary}
          placeholder={base.summary}
          maxLength={LIMITS.text.summary}
          onChange={(summary) => setDraft((d) => ({ ...d, summary }))}
        />
        <h4 className="tl-subhead">Tarjeta</h4>
        <p className="tl-hint tl-hint--top">Textos de la foto en la portada, los listados y el carrusel.</p>
        <div className="tl-grid2">
          <Field label="Título en la tarjeta" value={draft.card.name} placeholder={defaults.name} maxLength={LIMITS.text.name} onChange={(name) => setCard({ name })} />
          <Field label="Categoría" value={draft.card.cat} placeholder={defaults.cat} maxLength={LIMITS.text.cardShort} onChange={(cat) => setCard({ cat })} />
          <Field label="Subtítulo al pasar el ratón" hint="Solo en la portada." value={draft.card.overCat} placeholder={draft.card.cat || defaults.overCat} maxLength={LIMITS.text.cardShort} onChange={(overCat) => setCard({ overCat })} />
          <Field label="Línea inferior al pasar el ratón" hint="Solo en la portada." value={draft.card.loc} placeholder={defaults.loc} maxLength={LIMITS.text.cardLoc} onChange={(loc) => setCard({ loc })} />
        </div>
      </Section>
    </div>
  );
}

// ── Selector de punto focal ──────────────────────────────────────────────────

function FocalStage({ src, look, onChange }: { src: string; look: Look; onChange: (p: Partial<Look>) => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const clamp = (n: number) => Math.round(Math.min(100, Math.max(0, n)) * 10) / 10;

  function moveTo(e: PointerEvent) {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    onChange({ x: clamp(((e.clientX - r.left) / r.width) * 100), y: clamp(((e.clientY - r.top) / r.height) * 100) });
  }

  function onKey(e: KeyboardEvent) {
    const step = e.shiftKey ? 5 : 1;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const m = moves[e.key];
    if (!m) return;
    e.preventDefault();
    onChange({ x: clamp(look.x + m[0]), y: clamp(look.y + m[1]) });
  }

  return (
    <div className="tl-stage">
      <div
        ref={boxRef}
        className="tl-stage-box"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          moveTo(e);
        }}
        onPointerMove={(e) => dragging.current && moveTo(e)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <img src={src} alt="" draggable={false} />
        <button
          type="button"
          className="tl-focal"
          style={{ left: `${look.x}%`, top: `${look.y}%` }}
          onKeyDown={onKey}
          aria-label={`Punto focal: ${look.x}% horizontal, ${look.y}% vertical. Usa las flechas para moverlo.`}
        />
      </div>
    </div>
  );
}
