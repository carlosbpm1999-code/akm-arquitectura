import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { getTeamMember, teamMembers } from "@/data/team";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export const Route = createFileRoute("/equipo/$slug")({
  loader: ({ params }) => {
    const member = getTeamMember(params.slug);
    if (!member) throw notFound();
    return member;
  },
  head: ({ loaderData }) => {
    const m = loaderData ?? teamMembers[0];
    return {
      meta: [
        { title: `${m.name} — Equipo AKM Arquitectura` },
        { name: "description", content: (m.bio ?? m.spec).slice(0, 155) },
        { property: "og:title", content: `${m.name} — AKM Arquitectura` },
        { property: "og:description", content: (m.bio ?? m.spec).slice(0, 155) },
        { property: "og:image", content: m.img },
        { name: "twitter:image", content: m.img },
      ],
    };
  },
  component: TeamMemberPage,
  notFoundComponent: () => (
    <main className="team-page">
      <h1>Miembro no encontrado</h1>
      <Link to="/equipo">Volver al equipo</Link>
    </main>
  ),
  errorComponent: ({ error, reset }) => (
    <main className="team-page">
      <h1>Error</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Reintentar</button>
    </main>
  ),
});

function TeamMemberPage() {
  const m = Route.useLoaderData();
  const idx = teamMembers.findIndex((x) => x.slug === m.slug);
  const total = teamMembers.length;
  const prev = teamMembers[(idx - 1 + total) % total];
  const next = teamMembers[(idx + 1) % total];

  return (
    <>
      <Nav />

      <main className="team-page team-detail">
        <section className="team-hero">
          <Link to="/equipo" className="eyebrow">← Equipo</Link>
          <h1 className="hotels-title">{m.name}</h1>
          <p className="hotels-intro" style={{ whiteSpace: "pre-line" }}>{m.spec}</p>
        </section>

        <section className="team-detail-body">
          <div className="team-detail-media">
            <img
              src={m.img}
              srcSet={m.srcSet}
              sizes="(max-width: 720px) 100vw, 560px"
              alt={m.name}
              width={640}
              height={960}
              decoding="async"
            />
          </div>
          <div className="team-detail-text">
            <span className="eyebrow">{m.role}</span>
            {m.bio && <p>{m.bio}</p>}
          </div>
        </section>

        <nav className="team-detail-nav">
          <Link to="/equipo/$slug" params={{ slug: prev.slug }}>← {prev.name}</Link>
          <Link to="/equipo">Volver</Link>
          <Link to="/equipo/$slug" params={{ slug: next.slug }}>{next.name} →</Link>
        </nav>
      </main>
    </>
  );
}
