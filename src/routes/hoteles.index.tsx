import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { hotelProjects } from "@/data/hotelProjects";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

const heroSlides = hotelProjects.map((project) => ({
  img: project.images[0],
  name: project.name.replace("Catalonia ", ""),
  cat: `Hotel · ${project.meta.split(" · ")[0]}`,
  slug: project.slug,
}));

export const Route = createFileRoute("/hoteles/")({
  component: HotelesPage,
  head: () => ({
    meta: [
      { title: "Hoteles — AKM Kassem & Molinero Arquitectura" },
      {
        name: "description",
        content:
          "Casos de éxito de AKM Arquitectura en hoteles, restauración y rehabilitación hotelera para Catalonia Hotels y otros espacios singulares.",
      },
      { property: "og:title", content: "Hoteles — AKM Arquitectura" },
      {
        property: "og:description",
        content: "Selección de casos de éxito hoteleros desarrollados por AKM Arquitectura.",
      },
      {
        property: "og:image",
        content: "https://www.akmarquitectura.com/wp-content/uploads/2025/10/01.webp",
      },
      {
        name: "twitter:image",
        content: "https://www.akmarquitectura.com/wp-content/uploads/2025/10/01.webp",
      },
    ],
  }),
});

function HotelesPage() {
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
            <h1 className="hotels-title rv">Hoteles</h1>
            <p className="hotels-intro rv">
              Experiencia consolidada en rehabilitación, reforma interior y transformación de activos hoteleros con intervención sobre edificios históricos, espacios gastronómicos y entornos urbanos singulares.
            </p>
          </div>
          <div className="hotels-hero-media rv">
            <div className="hero-slider" aria-roledescription="carrusel">
              {heroSlides.map((s, i) => (
                <div
                  key={s.slug}
                  className={"hero-slide" + (i === slideIndex ? " is-active" : "")}
                  aria-hidden={i !== slideIndex}
                >
                  <img src={s.img} alt={s.name} loading={i === 0 ? "eager" : "lazy"} />
                  <div className="hero-slide-caption">
                    <span className="hero-slide-cat">{s.cat}</span>
                    <span className="hero-slide-name">{s.name}</span>
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
                    key={s.slug}
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

        <section className="hotels-cases" aria-labelledby="hoteles-casos">
          <div className="hotels-cases-head">
            <span className="eyebrow rv">Portfolio hotelero</span>
            <h2 className="heading rv" id="hoteles-casos">
              Selección de <em>proyectos</em>
            </h2>
          </div>
          <div className="hotels-list">
            {hotelProjects.map((project) => (
              <Link className="hotel-case rv" to="/hoteles/$slug" params={{ slug: project.slug }} key={project.name}>
                <div className="hotel-case-media">
                  <img src={project.images[0]} alt={project.name} loading="lazy" />
                </div>
                <h3>{project.name.replace("Catalonia ", "")}</h3>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}