import type { CSSProperties } from "react";

// Ajustes editables desde /tool. Se guardan en Cloudflare KV, clave "site-config" (ver src/server/kv.ts)
// y la web pública los lee en cada carga a través del loader de la ruta raíz.
// Este archivo es isomórfico: lo usan el servidor (validación) y el cliente (pintado).

export type Section = "hoteles" | "residencial";
/** Identificador único de proyecto: "hoteles/<slug>" o "residencial/<slug>". */
export type ProjectKey = string;

export type TintMode = "color" | "soft-light" | "multiply";

export type Look = {
  /** Punto focal del encuadre, en % (0–100). */
  x: number;
  y: number;
  /** Zoom del encuadre (1 = sin zoom). */
  zoom: number;
  /** Desenfoque en px. */
  blur: number;
  /** Brillo, contraste y saturación en % (100 = sin cambio). */
  brightness: number;
  contrast: number;
  saturation: number;
  /** Capa de color sobre la foto. */
  tint: string;
  tintAmount: number;
  tintMode: TintMode;
};

export type CardText = {
  name?: string;
  cat?: string;
  overCat?: string;
  loc?: string;
};

export type ProjectOverride = {
  /** Índice dentro de `images` de la foto de portada. */
  cover?: number;
  look?: Partial<Look>;
  name?: string;
  meta?: string;
  summary?: string;
  card?: CardText;
};

export type SiteConfig = {
  version: 1;
  updatedAt: string | null;
  updatedBy: string | null;
  /** Carrusel de la cabecera de la landing. */
  hero: ProjectKey[];
  /** Rejilla "Proyectos seleccionados" de la landing. */
  featured: ProjectKey[];
  projects: Record<ProjectKey, ProjectOverride>;
};

export const LIMITS = {
  hero: 10,
  featured: 9,
  zoom: [1, 3] as const,
  blur: [0, 20] as const,
  brightness: [50, 150] as const,
  contrast: [50, 150] as const,
  saturation: [0, 200] as const,
  tintAmount: [0, 100] as const,
  text: { name: 120, meta: 160, summary: 600, cardShort: 80, cardLoc: 120 },
};

export const DEFAULT_LOOK: Look = {
  x: 50,
  y: 50,
  zoom: 1,
  blur: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  tint: "#07262e",
  tintAmount: 0,
  tintMode: "color",
};

// Estado inicial: reproduce exactamente la landing tal y como estaba antes del panel.
export const DEFAULT_CONFIG: SiteConfig = {
  version: 1,
  updatedAt: null,
  updatedBy: null,
  hero: [
    "hoteles/hotel-catalonia-plaza-espana",
    "residencial/casa-cc2a",
    "hoteles/hotel-catalonia-mirador-des-port",
    "residencial/ausias-march-35",
    "hoteles/hotel-reina-victoria",
    "residencial/casa-olmeda",
  ],
  featured: [
    "hoteles/hotel-catalonia-plaza-espana",
    "residencial/ausias-march-35",
    "hoteles/hotel-catalonia-mirador-des-port",
    "residencial/casa-cc2a",
    "hoteles/hotel-catalonia-domenicus",
    "hoteles/hotel-reina-victoria",
    "hoteles/restaurante-espolin",
    "hoteles/hotel-catalonia-puerta-del-mar",
    "residencial/reforma-interior-c104",
  ],
  projects: {
    "hoteles/hotel-catalonia-plaza-espana": {
      card: { cat: "Hotel · Madrid", overCat: "Rehabilitación · 165 hab. · 1947", loc: "Gran Vía, Madrid · 9.651 m²" },
    },
    "residencial/ausias-march-35": {
      card: { name: "Ausiàs March, 35", cat: "Residencial · Barcelona", overCat: "Rehabilitación · 1888–1890", loc: "Barcelona · 3.410 m²" },
    },
    "hoteles/hotel-catalonia-mirador-des-port": {
      card: { cat: "Hotel · Menorca", overCat: "Rehab. & Ampliación · 54 hab.", loc: "Mahón, Menorca · 4.259 m²" },
    },
    "residencial/casa-cc2a": {
      card: { cat: "Vivienda · Obra Nueva", overCat: "5 Plantas · Piscina · Vistas al mar", loc: "5 dormitorios · Gimnasio · Sauna" },
    },
    "hoteles/hotel-catalonia-domenicus": {
      card: { cat: "Hotel · San Sebastián", overCat: "Obra Nueva · 122 hab.", loc: "Donostia · Iglesia San Bartolomé" },
    },
    "hoteles/hotel-reina-victoria": {
      card: { cat: "Hotel · Ronda", overCat: "Reforma Interior · 88 hab. · 1906", loc: "Ronda, Málaga · Vistas al Tajo" },
    },
    "hoteles/restaurante-espolin": {
      card: { cat: "Restauración · Valencia", overCat: "Reforma Interior · Bar · Comedor", loc: "Valencia" },
    },
    "hoteles/hotel-catalonia-puerta-del-mar": {
      card: { cat: "Hotel · Málaga", overCat: "Rehabilitación · 74 hab. · s. XIX", loc: "Málaga · Edificios históricos" },
    },
    "residencial/reforma-interior-c104": {
      card: { cat: "Residencial · Eixample Barcelona", overCat: "Reforma Integral · Plurifamiliar", loc: "Eixample, Barcelona" },
    },
  },
};

// ── Validación (el servidor la aplica a todo lo que lee y guarda) ─────────────

const KEY_RE = /^(hoteles|residencial)\/[a-z0-9-]{1,80}$/;

const num = (v: unknown, [min, max]: readonly [number, number], fallback: number) => {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
};

const str = (v: unknown, max: number) => {
  if (typeof v !== "string") return undefined;
  const s = v.replace(/\s+/g, " ").trim().slice(0, max);
  return s || undefined;
};

const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

export function sanitizeLook(input: unknown): Partial<Look> | undefined {
  if (!input || typeof input !== "object") return undefined;
  const l = input as Record<string, unknown>;
  const look: Look = {
    x: round(num(l.x, [0, 100], DEFAULT_LOOK.x), 1),
    y: round(num(l.y, [0, 100], DEFAULT_LOOK.y), 1),
    zoom: round(num(l.zoom, LIMITS.zoom, DEFAULT_LOOK.zoom)),
    blur: round(num(l.blur, LIMITS.blur, DEFAULT_LOOK.blur), 1),
    brightness: Math.round(num(l.brightness, LIMITS.brightness, DEFAULT_LOOK.brightness)),
    contrast: Math.round(num(l.contrast, LIMITS.contrast, DEFAULT_LOOK.contrast)),
    saturation: Math.round(num(l.saturation, LIMITS.saturation, DEFAULT_LOOK.saturation)),
    tint: typeof l.tint === "string" && /^#[0-9a-f]{6}$/i.test(l.tint) ? l.tint.toLowerCase() : DEFAULT_LOOK.tint,
    tintAmount: Math.round(num(l.tintAmount, LIMITS.tintAmount, DEFAULT_LOOK.tintAmount)),
    tintMode: l.tintMode === "soft-light" || l.tintMode === "multiply" ? l.tintMode : "color",
  };
  // Solo se guardan los valores que difieren del original
  const diff: Partial<Look> = {};
  for (const k of Object.keys(look) as (keyof Look)[]) {
    if (look[k] !== DEFAULT_LOOK[k]) (diff as Record<string, unknown>)[k] = look[k];
  }
  return Object.keys(diff).length ? diff : undefined;
}

export function sanitizeOverride(input: unknown): ProjectOverride | undefined {
  if (!input || typeof input !== "object") return undefined;
  const o = input as Record<string, unknown>;
  const out: ProjectOverride = {};
  if (Number.isInteger(o.cover) && (o.cover as number) > 0 && (o.cover as number) < 100) out.cover = o.cover as number;
  const look = sanitizeLook(o.look);
  if (look) out.look = look;
  const name = str(o.name, LIMITS.text.name);
  const meta = str(o.meta, LIMITS.text.meta);
  const summary = str(o.summary, LIMITS.text.summary);
  if (name) out.name = name;
  if (meta) out.meta = meta;
  if (summary) out.summary = summary;
  if (o.card && typeof o.card === "object") {
    const c = o.card as Record<string, unknown>;
    const card: CardText = {
      name: str(c.name, LIMITS.text.name),
      cat: str(c.cat, LIMITS.text.cardShort),
      overCat: str(c.overCat, LIMITS.text.cardShort),
      loc: str(c.loc, LIMITS.text.cardLoc),
    };
    for (const k of Object.keys(card) as (keyof CardText)[]) if (!card[k]) delete card[k];
    if (Object.keys(card).length) out.card = card;
  }
  return Object.keys(out).length ? out : undefined;
}

export function sanitizeKeyList(input: unknown, max: number): ProjectKey[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const out: ProjectKey[] = [];
  for (const k of input) {
    if (typeof k !== "string" || !KEY_RE.test(k) || seen.has(k)) continue;
    seen.add(k);
    out.push(k);
    if (out.length >= max) break;
  }
  return out;
}

export function isProjectKey(k: unknown): k is ProjectKey {
  return typeof k === "string" && KEY_RE.test(k);
}

export function sanitizeConfig(input: unknown): SiteConfig {
  if (!input || typeof input !== "object") return structuredClone(DEFAULT_CONFIG);
  const c = input as Record<string, unknown>;
  const projects: Record<ProjectKey, ProjectOverride> = {};
  if (c.projects && typeof c.projects === "object") {
    for (const [k, v] of Object.entries(c.projects as Record<string, unknown>)) {
      if (!KEY_RE.test(k)) continue;
      const o = sanitizeOverride(v);
      if (o) projects[k] = o;
    }
  }
  return {
    version: 1,
    updatedAt: typeof c.updatedAt === "string" ? c.updatedAt : null,
    updatedBy: typeof c.updatedBy === "string" ? c.updatedBy : null,
    hero: sanitizeKeyList(c.hero, LIMITS.hero),
    featured: sanitizeKeyList(c.featured, LIMITS.featured),
    projects,
  };
}

// ── Pintado ──────────────────────────────────────────────────────────────────

export function resolveLook(look?: Partial<Look>): Look {
  return { ...DEFAULT_LOOK, ...look };
}

export function isNeutralLook(look: Look) {
  return (Object.keys(DEFAULT_LOOK) as (keyof Look)[]).every((k) => look[k] === DEFAULT_LOOK[k]);
}

/**
 * Estilo inline para una foto de portada.
 * El filtro va en la variable --cf, que styles.css antepone a los filtros propios de cada
 * componente (así no se pierden los efectos hover). El zoom usa la propiedad `scale`,
 * que se suma al `transform` de los hovers en lugar de sustituirlo.
 */
export function coverStyle(look: Look): CSSProperties {
  const style: CSSProperties & Record<string, string> = {};
  const pos = `${look.x}% ${look.y}%`;
  if (pos !== "50% 50%") style.objectPosition = pos;

  const filters: string[] = [];
  if (look.blur > 0) filters.push(`blur(${look.blur}px)`);
  if (look.brightness !== 100) filters.push(`brightness(${look.brightness / 100})`);
  if (look.contrast !== 100) filters.push(`contrast(${look.contrast / 100})`);
  if (look.saturation !== 100) filters.push(`saturate(${look.saturation / 100})`);
  if (filters.length) style["--cf"] = filters.join(" ");

  // El desenfoque deja los bordes translúcidos: se compensa con un poco más de zoom
  const scale = look.zoom * (1 + look.blur * 0.02);
  if (scale !== 1) {
    style.scale = String(round(scale, 3));
    style.transformOrigin = pos;
  }
  return style;
}

export function tintStyle(look: Look): CSSProperties | null {
  if (look.tintAmount <= 0) return null;
  return { background: look.tint, opacity: look.tintAmount / 100, mixBlendMode: look.tintMode };
}
