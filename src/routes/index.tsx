import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import wordmarkDark from "@/assets/brand/akm-wordmark-dark.svg";
import patternDark from "@/assets/brand/akm-pattern-dark.svg";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

import imgPlazaEspana from "@/assets/hoteles/plaza-espana/01.jpg";
import { CoverImage } from "@/components/CoverImage";
import { useProjects } from "@/data/projects";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AKM Kassem & Molinero Arquitectura — Barcelona desde 1980" },
      {
        name: "description",
        content:
          "Estudio de arquitectura en Barcelona. Más de cuatro décadas en rehabilitación, obra nueva, hoteles y patrimonio. +2000 proyectos completados.",
      },
      {
        property: "og:title",
        content: "AKM Kassem & Molinero Arquitectura",
      },
      {
        property: "og:description",
        content: "Arquitectura que perdura. Estudio en Barcelona desde 1980.",
      },
      { property: "og:image", content: imgPlazaEspana },
      { name: "twitter:image", content: imgPlazaEspana },
    ],
  }),
});

const stats = [
  { val: 44, label: "Años de experiencia" },
  { val: 2000, label: "Proyectos completados", pre: "+" },
  { val: 150, label: "Hoteles intervenidos", pre: "+" },
  { text: "Sede en Barcelona" },
];

function Index() {
  // Carrusel y "Proyectos seleccionados" se eligen en /tool → Portada
  const { hero: heroSlides, featured: projects } = useProjects();
  const [slideIndex, setSlideIndex] = useState(0);
  const slideTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const slideCount = heroSlides.length;
  const goTo = (i: number) => slideCount && setSlideIndex((i + slideCount) % slideCount);
  const next = () => goTo(slideIndex + 1);
  const prev = () => goTo(slideIndex - 1);

  useEffect(() => {
    if (slideTimer.current) clearInterval(slideTimer.current);
    if (slideCount < 2) return;
    slideTimer.current = setInterval(() => {
      setSlideIndex((i) => (i + 1) % slideCount);
    }, 5500);
    return () => {
      if (slideTimer.current) clearInterval(slideTimer.current);
    };
  }, [slideIndex, slideCount]);

  // Si cambia el número de diapositivas, que el índice no se quede fuera de rango
  const activeSlide = slideCount ? slideIndex % slideCount : 0;

  useEffect(() => {
    // Reveal on scroll
    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            setTimeout(() => el.classList.add("on"), i * 55);
            ob.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px 350px 0px" },
    );
    document.querySelectorAll(".rv").forEach((el) => ob.observe(el));

    // Count up
    const counters = document.querySelectorAll<HTMLElement>(".stat-n[data-val]");
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const to = Number(el.dataset.val || "0");
          const pre = el.dataset.pre || "";
          const start = performance.now();
          const dur = 2000;
          const tick = (now: number) => {
            const p = Math.min((now - start) / dur, 1);
            const v = 1 - Math.pow(1 - p, 3);
            el.textContent = pre + Math.round(v * to).toLocaleString("es-ES");
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.4 },
    );
    counters.forEach((c) => counterObserver.observe(c));

    return () => {
      ob.disconnect();
      counterObserver.disconnect();
    };
  }, []);

  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="hero" id="inicio">
        <div className="hero-l">
          <h1 className="hero-h1">
            Arquitectura<br />que <em>perdura</em>
          </h1>
          <p className="hero-p">
            Más de cuatro décadas transformando edificios, espacios y ciudades con rigor técnico, memoria histórica y visión contemporánea.
          </p>
        </div>
        <div className="hero-r">
          <div className="hero-slider" aria-roledescription="carrusel">
            {heroSlides.map((s, i) => (
              <div
                key={s.key}
                className={"hero-slide" + (i === activeSlide ? " is-active" : "")}
                aria-hidden={i !== activeSlide}
              >
                <CoverImage src={s.cover} alt={s.name} look={s.look} loading={i === 0 ? "eager" : "lazy"} />
                <div className="hero-slide-caption">
                  <span className="hero-slide-cat">{s.card.cat}</span>
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
                  className={"hero-slide-bullet" + (i === activeSlide ? " is-active" : "")}
                  onClick={() => goTo(i)}
                  aria-label={`Ir al proyecto ${i + 1}`}
                  aria-selected={i === activeSlide}
                  role="tab"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        {stats.map((s) => (
          <div className="stat rv" key={s.label ?? s.text}>
            {s.text ? (
              <span className="stat-n">{s.text}</span>
            ) : (
              <>
                <span className="stat-n" data-val={s.val} data-pre={s.pre || ""}>
                  0
                </span>
                <span className="stat-l">{s.label}</span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ABOUT */}
      <section className="about" id="estudio">
        <div className="about-l">
          <span className="eyebrow rv">Sobre el estudio</span>
          <h2 className="heading rv">
            Historia &amp;<br />
            <em>Visión de futuro</em>
          </h2>
          <div className="prose">
            <p className="rv">
              La firma <strong>Arqués–Kassem &amp; Molinero Arquitectura</strong> es la sucesión natural de{" "}
              <strong>Arqués–Molinero i Associats</strong>, que lleva desarrollando proyectos desde 1980. Más de cuatro décadas de experiencia en todo tipo de escalas y tipologías.
            </p>
            <p className="rv">
              Nuestro principal objetivo es ofrecer un servicio de <strong>alta calidad, personalizado y profesional</strong>, que cumpla con todas las garantías necesarias. Más de mil encargos completados avalan la confianza depositada en nosotros.
            </p>
            <p className="rv">
              Nos comprometemos a <strong>superar las expectativas</strong> de cada cliente, haciendo que cada proyecto sea una experiencia satisfactoria y exitosa, desde el primer boceto hasta la entrega final.
            </p>
          </div>
        </div>
        <div className="about-r about-brand rv">
          <img src={wordmarkDark} alt="Arqués – Kassem & Molinero Arquitectura" />
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio">
        <div className="port-head">
          <div>
            <h2 className="heading heading-portfolio rv" style={{ marginBottom: 0 }}>
              Proyectos<br />
              <em>seleccionados</em>
            </h2>
          </div>
        </div>
        <div className="pgrid">
          {projects.map((p, i) => (
            <Link
              className="pc rv"
              key={p.key}
              to={p.section === "hoteles" ? "/hoteles/$slug" : "/residencial/$slug"}
              params={{ slug: p.slug }}
            >
              <span className="pc-idx">{String(i + 1).padStart(2, "0")}</span>
              <CoverImage src={p.cover} alt={p.name} look={p.look} loading="lazy" />
              <div className="pc-label">
                <p className="pc-cat">{p.card.cat}</p>
                <h3 className="pc-name">{p.card.name}</h3>
              </div>
              <div className="pc-over">
                <div className="pc-over-bar"></div>
                <p className="pc-over-cat">{p.card.overCat}</p>
                <h3 className="pc-over-name">{p.card.name}</h3>
                <p className="pc-over-loc">{p.card.loc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* QUOTE */}
      <div className="quote-strip">
        <div className="quote-pattern" style={{ backgroundImage: `url(${patternDark})` }} />
        <div className="rv">
          <blockquote>
            "Cada edificio es una conversación entre el pasado y el futuro"
          </blockquote>
        </div>
        <div className="quote-r rv">
          <p>
            Cada encargo que recibimos es tratado con la misma dedicación y exigencia, sea cual sea su escala o programa. Creemos en la arquitectura como disciplina capaz de mejorar la vida de las personas y el tejido de la ciudad.
          </p>
          <p>
            La experiencia acumulada en más de cuatro décadas nos permite afrontar cualquier tipología con solvencia técnica, creatividad y compromiso absoluto con el cliente.
          </p>
        </div>
      </div>

      {/* CONTACT */}
      <section className="contact" id="contacto">
        <span className="eyebrow rv">Contacto</span>
        <h2 className="heading rv">
          Tu proyecto <em>empieza aquí</em>
        </h2>
        <div className="contact-grid">
          <div>
            <div className="citem rv">
              <div>
                <p className="ck">Teléfono</p>
                <a href="tel:932453032" className="cv">932 453 032</a>
              </div>
            </div>
            <div className="citem rv">
              <div>
                <p className="ck">Email</p>
                <a href="mailto:info@akmarquitectura.com" className="cv">
                  info@akmarquitectura.com
                </a>
              </div>
            </div>
            <div className="citem rv">
              <div>
                <p className="ck">Estudio</p>
                <span className="cv">
                  C/ Bailén 176, entresuelo 2a<br />08037 Barcelona
                </span>
              </div>
            </div>
            <Link to="/contacto" hash="formulario" className="contact-cta rv">
              Envíanos un mensaje
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <div className="socials rv">
              <a
                href="https://www.instagram.com/akm_arquitectura/"
                target="_blank"
                rel="noreferrer"
                className="soc soc--instagram"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4.2" />
                </svg>
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/akm-arquitectura/"
                target="_blank"
                rel="noreferrer"
                className="soc soc--linkedin"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <line x1="8" y1="10" x2="8" y2="17" />
                  <circle cx="8" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
                  <path d="M12 17v-4.3a2.4 2.4 0 014.8 0V17" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
          <div className="rv">
            <p className="map-label">Ubicación del estudio</p>
            <div className="map-wrap">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.065!2d2.172694!3d41.403578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a2ef49f83f47%3A0x3b5c5e7e2b5c5e5e!2sCarrer%20de%20Bail%C3%A9n%2C%20176%2C%20L%27Eixample%2C%2008037%20Barcelona!5e0!3m2!1ses!2ses!4v1710000000000!5m2!1ses!2ses"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AKM Arquitectura"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
