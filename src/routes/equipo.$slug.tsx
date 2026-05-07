import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import logo from "@/assets/akm-logo.png";
import { MobileNavToggle } from "@/components/MobileNavToggle";
import { getTeamMember, teamMembers } from "@/data/team";

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
  const navRef = useRef<HTMLElement | null>(null);
  const idx = teamMembers.findIndex((x) => x.slug === m.slug);
  const total = teamMembers.length;
  const prev = teamMembers[(idx - 1 + total) % total];
  const next = teamMembers[(idx + 1) % total];

  useEffect(() => {
    const onScroll = () => {
      navRef.current?.classList.toggle("up", window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className="akm-nav" ref={navRef}>
        <Link to="/" className="nav-logo">
          <img src={logo} alt="AKM Kassem & Molinero Arquitectura" />
        </Link>
        <ul className="nav-links">
          <li><a href="/#estudio">Estudio</a></li>
          <li><a href="/#portfolio">Portfolio</a></li>
          <li><Link to="/hoteles">Hoteles</Link></li>
          <li><Link to="/residencial">Residencial</Link></li>
          <li><Link to="/equipo">Equipo</Link></li>
          <li><a href="/contacto">Contacto</a></li>
        </ul>
        <MobileNavToggle />
      </nav>

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
