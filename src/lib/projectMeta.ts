export type ProjectStats = {
  city?: string;
  year?: string;
  area?: string;
};

// Separa el campo `meta` ("Ciudad · Año · m²") en sus partes.
export function parseProjectMeta(meta: string): ProjectStats {
  const stats: ProjectStats = {};
  for (const raw of meta.split(" · ")) {
    const part = raw.trim();
    if (/m²/.test(part)) stats.area = `${part} construidos`;
    else if (/^\d{4}/.test(part)) stats.year = part;
    else if (part && !/^vivienda/i.test(part)) stats.city = part;
  }
  return stats;
}

// Versión en una línea: "Madrid · 2005 · 4.473 m² construidos"
export function formatProjectMeta(meta: string): string {
  const { city, year, area } = parseProjectMeta(meta);
  const parts = [city, year, area].filter(Boolean);
  return parts.length ? parts.join(" · ") : meta;
}
