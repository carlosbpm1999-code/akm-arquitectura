import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CoverImage } from "@/components/CoverImage";
import { useProjects } from "@/data/projects";
import { Footer } from "@/components/Footer";
import { ProjectCta } from "@/components/ProjectCta";
import { Nav } from "@/components/Nav";
import { formatProjectMeta } from "@/lib/projectMeta";

export const Route = createFileRoute("/residencial/")({
  component: ResidencialPage,
  head: () => ({
    meta: [
      { title: "Residencial — AKM Kassem & Molinero Arquitectura" },
      {
        name: "description",
        content:
          "Casos de éxito residenciales de AKM Arquitectura: rehabilitación, reforma interior, obra nueva y viviendas singulares.",
      },
      { property: "og:title", content: "Residencial — AKM Arquitectura" },
      {
        property: "og:description",
        content: "Selección de proyectos residenciales desarrollados por AKM Arquitectura.",
      },
      {
        property: "og:image",
        content: "https://www.akmarquitectura.com/wp-content/uploads/2023/07/Barcelona-2004-Superficie-3.410m2.jpg",
      },
      {
        name: "twitter:image",
        content: "https://www.akmarquitectura.com/wp-content/uploads/2023/07/Barcelona-2004-Superficie-3.410m2.jpg",
      },
    ],
  }),
});

function ResidencialPage() {
  const heroSlides = useProjects().residencial;
  const [slideIndex, setSlideIndex] = useState(0);
  const slideTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (i: number) => setSlideIndex((i + heroSlides.length) % heroSlides.length);
  const next = () => goTo(slideIndex + 1);
  const prev = () => goTo(slideIndex - 1);

  useEffect(() => {
    if (slideTimer.current) clearInterval(slideTimer.current);
    slideTimer.current = setInterval(() => {
      setSlideIndex((i) => (i + 1) % heroSlides.length);
    }, 5500);
    return () => {
      if (slideTimer.current) clearInterval(slideTimer.current);
    };
  }, [slideIndex]);

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
      { threshold: 0.12, rootMargin: "0px 0px 350px 0px" },
    );
    document.querySelectorAll(".rv").forEach((el) => ob.observe(el));

    return () => {
      ob.disconnect();
    };
  }, []);

  return (
    <>
      <Nav />

      <main className="hotels-page">
        <section className="hotels-hero">
          <div className="hotels-hero-copy">
            <span className="eyebrow rv">Casos de éxito</span>
            <h1 className="hotels-title rv">Residencial</h1>
            <p className="hotels-intro rv">
              Proyectos de rehabilitación, reforma interior y vivienda singular donde precisión técnica, habitabilidad y contexto urbano definen cada intervención.
            </p>
          </div>
          <div className="hotels-hero-media rv">
            <div className="hero-slider" aria-roledescription="carrusel">
              {heroSlides.map((s, i) => (
                <div
                  key={s.key}
                  className={"hero-slide" + (i === slideIndex ? " is-active" : "")}
                  aria-hidden={i !== slideIndex}
                >
                  <CoverImage src={s.cover} alt={s.name} look={s.look} loading={i === 0 ? "eager" : "lazy"} />
                  <div className="hero-slide-caption">
                    <span className="hero-slide-cat">Residencial</span>
                    <span className="hero-slide-name">{s.card.name}</span>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="hero-slide-arrow hero-slide-arrow-prev"
                onClick={prev}
                aria-label="Anterior"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <button
                type="button"
                className="hero-slide-arrow hero-slide-arrow-next"
                onClick={next}
                aria-label="Siguiente"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>

              <div className="hero-slide-bullets" role="tablist">
                {heroSlides.map((s, i) => (
                  <button
                    key={s.key}
                    type="button"
                    className={"hero-slide-bullet" + (i === slideIndex ? " is-active" : "")}
                    onClick={() => goTo(i)}
                    aria-label={`Ir al proyecto ${i + 1}`}
                    aria-selected={i === slideIndex}
                    role="tab"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="hotels-cases" aria-labelledby="residencial-casos">
          <div className="port-head">
            <h2 className="heading heading-portfolio rv" id="residencial-casos" style={{ marginBottom: 0 }}>
              Selección de<br />
              <em>proyectos</em>
            </h2>
          </div>
          <div className="pgrid pgrid-list">
            {heroSlides.map((project, i) => {
              const { name, cat } = project.card;
              return (
                <Link
                  className="pc rv"
                  to="/residencial/$slug"
                  params={{ slug: project.slug }}
                  key={project.slug}
                >
                  <span className="pc-idx">{String(i + 1).padStart(2, "0")}</span>
                  <CoverImage src={project.cover} alt={project.name} look={project.look} loading="lazy" />
                  <div className="pc-label">
                    <p className="pc-cat">{cat}</p>
                    <h3 className="pc-name">{name}</h3>
                  </div>
                  <div className="pc-over">
                    <div className="pc-over-bar"></div>
                    <p className="pc-over-cat">{cat}</p>
                    <h3 className="pc-over-name">{name}</h3>
                    <p className="pc-over-loc">{formatProjectMeta(project.meta)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <ProjectCta />
      <Footer />
    </>
  );
}