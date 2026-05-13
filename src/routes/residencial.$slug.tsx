import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { getResidentialProject, residentialProjects } from "@/data/residentialProjects";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

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
        { property: "og:image", content: project.images[0] },
        { name: "twitter:image", content: project.images[0] },
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
  const currentIndex = residentialProjects.findIndex((item) => item.slug === project.slug);
  const total = residentialProjects.length;
  const prevProject = residentialProjects[(currentIndex - 1 + total) % total];
  const nextProject = residentialProjects[(currentIndex + 1) % total];
  const related = residentialProjects.filter((item) => item.slug !== project.slug).slice(0, 3);

  useEffect(() => {

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
      ob.disconnect();
    };
  }, []);

  return (
    <>
      <Nav />

      <main className="hotels-page project-page">
        <section className="project-hero">
          <div className="project-hero-copy">
            <Link to="/residencial" className="project-back rv">← Residencial</Link>
            <span className="eyebrow rv">Proyecto residencial</span>
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
                  <img src={item.images[0]} alt={item.name} loading="lazy" />
                </div>
                <h3>{item.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}