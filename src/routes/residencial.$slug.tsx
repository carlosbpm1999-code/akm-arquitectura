import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { CoverImage } from "@/components/CoverImage";
import { applyOverride, baseProjectByKey, configFromMatches, useProjects } from "@/data/projects";
import { Footer } from "@/components/Footer";
import { ProjectCta } from "@/components/ProjectCta";
import { Nav } from "@/components/Nav";
import { ProjectStatsBar } from "@/components/ProjectStatsBar";

export const Route = createFileRoute("/residencial/$slug")({
  loader: ({ params }) => {
    const base = baseProjectByKey.get(`residencial/${params.slug}`);
    if (!base) throw notFound();
    return base;
  },
  head: ({ loaderData, matches }) => {
    if (!loaderData) return {};
    const project = applyOverride(loaderData, configFromMatches(matches));
    return {
      meta: [
        { title: `${project.name} — AKM Arquitectura` },
        { name: "description", content: project.summary.slice(0, 155) },
        { property: "og:title", content: `${project.name} — AKM Arquitectura` },
        { property: "og:description", content: project.summary.slice(0, 155) },
        { property: "og:image", content: project.cover },
        { name: "twitter:image", content: project.cover },
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
  const base = Route.useLoaderData();
  const { residencial: list, byKey } = useProjects();
  const project = byKey.get(base.key)!;
  const currentIndex = list.findIndex((item) => item.slug === project.slug);
  const total = list.length;
  const prevProject = list[(currentIndex - 1 + total) % total];
  const nextProject = list[(currentIndex + 1) % total];
  const related = list.filter((item) => item.slug !== project.slug).slice(0, 3);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.querySelectorAll<HTMLElement>(".rv").forEach((el) => el.classList.remove("on"));

    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          setTimeout(() => el.classList.add("on"), index * 45);
          ob.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px 350px 0px" },
    );
    document.querySelectorAll(".rv").forEach((el) => ob.observe(el));

    return () => { ob.disconnect(); };
  }, [project.slug]);

  return (
    <>
      <Nav />

      <main className="hotels-page project-page">
        <section className={"project-hero" + (project.wideCover ? " project-hero--wide-cover" : "")}>
          <div className="project-hero-copy">
            <Link to="/residencial" className="project-back rv">← Residencial</Link>
            <span className="eyebrow rv">Proyecto residencial</span>
            <h1 className="project-title rv">{project.name}</h1>
            <ProjectStatsBar meta={project.meta} />
          </div>
          <div className="project-hero-media rv">
            <CoverImage src={project.cover} alt={project.name} look={project.look} />
          </div>
        </section>

        <section className="project-body">
          <div className="project-text rv">
            {project.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="project-gallery" aria-label={`Galería de ${project.name}`}>
          {project.gallery.map(({ src, index }) => {
            const noCrop = project.noCropIndexes?.includes(index);
            return (
              <figure
                className={"project-gallery-item rv" + (noCrop ? " project-gallery-item--contain" : "")}
                key={src}
              >
                <img src={src} alt={`${project.name} — imagen ${index + 1}`} loading="lazy" />
              </figure>
            );
          })}
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
                  <CoverImage src={item.cover} alt={item.name} look={item.look} loading="lazy" />
                </div>
                <h3>{item.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <ProjectCta />
      <Footer />
    </>
  );
}