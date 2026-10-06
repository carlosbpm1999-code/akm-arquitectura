import { parseProjectMeta } from "@/lib/projectMeta";

export function ProjectStatsBar({ meta }: { meta: string }) {
  const { city, year, area } = parseProjectMeta(meta);
  const items = [
    { label: "Ciudad", value: city },
    { label: "Año", value: year },
    { label: "Superficie", value: area },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  if (!items.length) return <p className="project-meta rv">{meta}</p>;

  return (
    <dl className="project-stats rv">
      {items.map((item) => (
        <div className="project-stat" key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
