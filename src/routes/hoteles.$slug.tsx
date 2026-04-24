import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import logo from "@/assets/akm-logo.png";
import { getHotelProject, hotelProjects } from "@/data/hotelProjects";

export const Route = createFileRoute("/hoteles/$slug")({
  loader: ({ params }) => {
    const project = getHotelProject(params.slug);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData }) => {
    const project = loaderData ?? hotelProjects[0];

    return {
      meta: [
        { title: `${project.name} — AKM Arquitectura` },
      {
        name: "description",
        content: project.summary.slice(0, 155),
      },
        { property: "og:title", content: `${project.name} — AKM Arquitectura` },
        { property: "og:description", content: project.summary.slice(0, 155) },
        { property: "og:image", content: project.images[0] },
        { name: "twitter:image", content: project.images[0] },
      ],
    };
  },
  component: HotelDetailPage,
  notFoundComponent: () => (
    <main className="hotels-page project-not-found">
      <h1>Proyecto no encontrado</h1>
      <Link to="/hoteles">Volver a Hoteles</Link>
    </main>
  ),
});

function HotelDetailPage() {
  const project = Route.useLoaderData();
  const navRef = useRef<HTMLElement | null>(null);
  const related = hotelProjects.filter((item) => item.slug !== project.slug).slice(0, 3);

  useEffect(() => {
    const onScroll = () => {
      navRef.current?.classList.toggle("up", window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll);

    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          setTimeout(() => el.classList.add("on"), index * 45);
          ob.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll(".rv").forEach((el) => ob.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      ob.disconnect();
    };
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
          <li><a href="/#equipo">Equipo</a></li>
          <li><a href="/#contacto">Contacto</a></li>
        </ul>
      </nav>

      <main className="hotels-page project-page">
        <section className="project-hero">
          <div className="project-hero-copy">
            <Link to="/hoteles" className="project-back rv">← Hoteles</Link>
            <span className="eyebrow rv">Caso de éxito</span>
            <h1 className="project-title rv">{project.name}</h1>
            <p className="project-meta rv">{project.meta}</p>
          </div>
          <div className="project-hero-media rv">
            <img src={project.images[0]} alt={project.name} />
          </div>
        </section>

        <section className="project-body">
          <aside className="project-aside rv">
            <span className="eyebrow">Descripción</span>
            <a href={project.sourceUrl} target="_blank" rel="noreferrer">Ver fuente original</a>
          </aside>
          <div className="project-text rv">
            {project.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="project-gallery" aria-label={`Galería de ${project.name}`}>
          {project.images.slice(1).map((image, index) => (
            <figure className="project-gallery-item rv" key={image}>
              <img src={image} alt={`${project.name} — imagen ${index + 2}`} loading="lazy" />
            </figure>
          ))}
        </section>

        <section className="project-related">
          <div className="hotels-cases-head">
            <span className="eyebrow rv">Más hoteles</span>
            <h2 className="heading rv">Otros <em>casos</em></h2>
          </div>
          <div className="hotels-list">
            {related.map((item, index) => (
              <Link className="hotel-case rv" to="/hoteles/$slug" params={{ slug: item.slug }} key={item.slug}>
                <div className="hotel-case-media">
                  <img src={item.images[0]} alt={item.name} loading="lazy" />
                </div>
                <span className="hotel-case-number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.name}</h3>
                <span className="hotel-case-type">Caso de éxito</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="akm-footer">
        <div className="f-top">
          <Link to="/" className="f-logo">
            <img src={logo} alt="AKM Kassem & Molinero Arquitectura" />
          </Link>
          <div className="f-center">
            <nav className="f-nav">
              <a href="/#estudio">Estudio</a>
              <a href="/#portfolio">Portfolio</a>
              <Link to="/hoteles">Hoteles</Link>
              <Link to="/residencial">Residencial</Link>
              <a href="/#equipo">Equipo</a>
              <a href="/#contacto">Contacto</a>
            </nav>
          </div>
          <div className="f-right">
            <div className="f-social">
              <a href="https://www.instagram.com/akm_arquitectura/" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://www.linkedin.com/company/akm-arquitectura/" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="f-bottom">
          <span className="f-copy">
            © 2025 Arqués–Kassem–Molinero Associats, SLP &nbsp;·&nbsp; C/ Bailén 176, entresuelo 2a, 08037 Barcelona &nbsp;·&nbsp; info@akmarquitectura.com
          </span>
        </div>
      </footer>
    </>
  );
}
