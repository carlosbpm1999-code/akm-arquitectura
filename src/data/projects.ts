import { useMemo } from "react";
import { useLoaderData } from "@tanstack/react-router";
import { hotelProjects as rawHotels } from "@/data/hotelProjects";
import { residentialProjects as rawResidential } from "@/data/residentialProjects";
import { formatProjectMeta } from "@/lib/projectMeta";
import {
  DEFAULT_CONFIG,
  resolveLook,
  type CardText,
  type Look,
  type ProjectKey,
  type Section,
  type SiteConfig,
} from "@/lib/site-config";

// Proyectos tal y como están en el código, sin los ajustes de /tool.
export type BaseProject = {
  key: ProjectKey;
  section: Section;
  slug: string;
  name: string;
  meta: string;
  summary: string;
  description: string[];
  images: string[];
  wideCover?: boolean;
  noCropIndexes?: number[];
};

// Proyecto con los ajustes de /tool aplicados. Es lo que pinta la web pública.
export type Project = BaseProject & {
  coverIndex: number;
  cover: string;
  look: Look;
  /** Fotos de la galería (todas menos la portada), con su índice original en `images`. */
  gallery: { src: string; index: number }[];
  card: Required<CardText>;
};

export const baseProjects: BaseProject[] = [
  ...rawHotels.map((p) => ({ ...p, key: `hoteles/${p.slug}`, section: "hoteles" as const })),
  ...rawResidential.map((p) => ({ ...p, key: `residencial/${p.slug}`, section: "residencial" as const })),
];

export const baseProjectByKey = new Map(baseProjects.map((p) => [p.key, p]));

const city = (meta: string) => meta.split(" · ")[0];

export function defaultCard(p: Pick<BaseProject, "section" | "name" | "meta">): Required<CardText> {
  const cat = `${p.section === "hoteles" ? "Hotel" : "Residencial"} · ${city(p.meta)}`;
  return {
    name: p.name.replace("Catalonia ", ""),
    cat,
    overCat: cat,
    loc: formatProjectMeta(p.meta),
  };
}

export function applyOverride(base: BaseProject, config: SiteConfig): Project {
  const o = config.projects[base.key] ?? {};
  const name = o.name ?? base.name;
  const meta = o.meta ?? base.meta;
  const coverIndex = o.cover !== undefined && o.cover < base.images.length ? o.cover : 0;
  const card = defaultCard({ section: base.section, name, meta });
  return {
    ...base,
    name,
    meta,
    summary: o.summary ?? base.summary,
    coverIndex,
    cover: base.images[coverIndex],
    look: resolveLook(o.look),
    gallery: base.images.map((src, index) => ({ src, index })).filter((g) => g.index !== coverIndex),
    card: { ...card, ...o.card },
  };
}

export function buildProjects(config: SiteConfig) {
  const all = baseProjects.map((p) => applyOverride(p, config));
  const byKey = new Map(all.map((p) => [p.key, p]));
  const pick = (keys: ProjectKey[]) => keys.map((k) => byKey.get(k)).filter((p): p is Project => !!p);
  return {
    all,
    byKey,
    hoteles: all.filter((p) => p.section === "hoteles"),
    residencial: all.filter((p) => p.section === "residencial"),
    hero: pick(config.hero),
    featured: pick(config.featured),
  };
}

export type Projects = ReturnType<typeof buildProjects>;

/** Ajustes de /tool, cargados por el loader de la ruta raíz. */
export function useSiteConfig(): SiteConfig {
  const data = useLoaderData({ from: "__root__" }) as SiteConfig | undefined;
  return data ?? DEFAULT_CONFIG;
}

export function useProjects(): Projects {
  const config = useSiteConfig();
  return useMemo(() => buildProjects(config), [config]);
}

/** Para `head()`: los ajustes vienen en el match de la ruta raíz. */
export function configFromMatches(matches: { routeId: string; loaderData?: unknown }[]): SiteConfig {
  const root = matches.find((m) => m.routeId === "__root__");
  return (root?.loaderData as SiteConfig | undefined) ?? DEFAULT_CONFIG;
}
