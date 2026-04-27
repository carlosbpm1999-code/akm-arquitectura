import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import logo from "@/assets/akm-logo.png";
import { getResidentialProject, residentialProjects } from "@/data/residentialProjects";

export const Route = createFileRoute("/residencial/$slug")({
  loader: ({ params }) => {
    const project = getResidentialProject(params.slug);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData }) => {
    const project = loaderData ?? residentialProjects[0];
    return {
      meta: [
        { title: `${project.name} — AKM Arquitectura` },
        { name: "description", content: project.summary.slice(0, 155) },
        { property: "og:title", content: `${project.name} — AKM Arquitectura` },
        { property: "og:description", content: project.summary.slice(0, 155) },
        { property: "og:image", content: project.image },
        { name: "twitter:image", content: project.image },
      ],
    };
  },
  component: ResidentialDetailPage,
  notFoundComponent: () => (
    <main className="hotels-page project-not-found">
      <h1>Proyecto no encontrado</h1>
      <Link to="/residencial">Volver a Residencial</Link>
    </main>
  ),
});

function ResidentialDetailPage() {
  const project = Route.useLoaderData();
  const navRef = useRef<HTMLElement | null>(null);
  const currentIndex = residentialProjects.findIndex((item) => item.slug === project.slug);
  const total = residentialProjects.length;
  const prevProject = residentialProjects[(currentIndex - 1 + total) % total];
  const nextProject = residentialProjects[(currentIndex + 1) % total];
  const related = residentialProjects.filter((item) => item.slug !== project.slug).slice(0, 3);

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
            <Link to="/residencial" className="project-back rv">← Residencial</Link>
            <span className="eyebrow rv">Proyecto residencial</span>
            <h1 className="project-title rv">{project.name}</h1>
            <p className="project-meta rv">{project.meta}</p>
          </div>
          <div className="project-hero-media rv">
            <img src={project.image} alt={project.name} />
          </div>
        </section>

        <section className="project-body">
          <aside className="project-aside rv">
            <span className="eyebrow">Descripción</span>
          </aside>
          <div className="project-text rv">
            {project.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <nav className="project-pager rv" aria-label="Navegación entre proyectos">
          <Link
            to="/residencial/$slug"
            params={{ slug: prevProject.slug }}
            className="project-pager-link prev"
          >
            <span className="project-pager-arrow">←</span>
            <span className="project-pager-meta">
              <span className="project-pager-label">Anterior</span>
              <span className="project-pager-name">{prevProject.name}</span>
            </span>
          </Link>
          <Link to="/residencial" className="project-pager-all">Ver todos</Link>
          <Link
            to="/residencial/$slug"
            params={{ slug: nextProject.slug }}
            className="project-pager-link next"
          >
            <span className="project-pager-meta">
              <span className="project-pager-label">Siguiente</span>
              <span className="project-pager-name">{nextProject.name}</span>
            </span>
            <span className="project-pager-arrow">→</span>
          </Link>
        </nav>

        <section className="project-related">
          <div className="hotels-cases-head">
            <span className="eyebrow rv">Más proyectos</span>
            <h2 className="heading rv">Otros <em>residenciales</em></h2>
          </div>
          <div className="hotels-list">
            {related.map((item) => (
              <Link
                className="hotel-case rv"
                to="/residencial/$slug"
                params={{ slug: item.slug }}
                key={item.slug}
              >
                <div className="hotel-case-media">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
                <h3>{item.name}</h3>
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
              <Link to="/privacidad">Privacidad</Link>
              <Link to="/cookies">Cookies</Link>
              <Link to="/aviso-legal">Aviso Legal</Link>
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