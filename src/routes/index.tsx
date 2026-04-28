import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import logo from "@/assets/akm-logo.png";
import { MobileNavToggle } from "@/components/MobileNavToggle";
import { teamMembers as team } from "@/data/team";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AKM Kassem & Molinero Arquitectura — Barcelona desde 1980" },
      {
        name: "description",
        content:
          "Estudio de arquitectura en Barcelona. Más de cuatro décadas en rehabilitación, obra nueva, hoteles y patrimonio. +1500 proyectos completados.",
      },
      {
        property: "og:title",
        content: "AKM Kassem & Molinero Arquitectura",
      },
      {
        property: "og:description",
        content: "Arquitectura que perdura. Estudio en Barcelona desde 1980.",
      },
      {
        property: "og:image",
        content:
          "https://www.akmarquitectura.com/wp-content/uploads/2025/10/01.webp",
      },
      {
        name: "twitter:image",
        content:
          "https://www.akmarquitectura.com/wp-content/uploads/2025/10/01.webp",
      },
    ],
  }),
});

const projects = [
  {
    idx: "01",
    img: "https://www.akmarquitectura.com/wp-content/uploads/2025/10/01.webp",
    cat: "Hotel 4★ · Madrid",
    name: "Hotel Catalonia Plaza España",
    overCat: "Rehabilitación · 165 hab. · 1947",
    loc: "Gran Vía, Madrid · 9.651 m²",
  },
  {
    idx: "02",
    img: "https://www.akmarquitectura.com/wp-content/uploads/2023/07/Barcelona-2004-Superficie-3.410m2.jpg",
    cat: "Residencial · Barcelona",
    name: "Ausiàs March, 35",
    overCat: "Rehabilitación · 1888–1890",
    loc: "Barcelona · 3.410 m²",
  },
  {
    idx: "03",
    img: "https://www.akmarquitectura.com/wp-content/uploads/2024/03/00-scaled.jpg",
    cat: "Hotel · Menorca",
    name: "Hotel Catalonia Mirador des Port",
    overCat: "Rehab. & Ampliación · 54 hab.",
    loc: "Mahón, Menorca · 4.259 m²",
  },
  {
    idx: "04",
    img: "https://www.akmarquitectura.com/wp-content/uploads/2026/01/CC2A_1.webp",
    cat: "Vivienda · Obra Nueva",
    name: "Casa CC2A",
    overCat: "5 Plantas · Piscina · Vistas al mar",
    loc: "5 dormitorios · Gimnasio · Sauna",
  },
  {
    idx: "05",
    img: "https://www.akmarquitectura.com/wp-content/uploads/2024/03/000-1.jpg",
    cat: "Hotel 4★ · San Sebastián",
    name: "Hotel Catalonia Donosti",
    overCat: "Obra Nueva · 122 hab.",
    loc: "Donostia · Iglesia San Bartolomé",
  },
  {
    idx: "06",
    img: "https://www.akmarquitectura.com/wp-content/uploads/2023/06/comerical2-1.jpg",
    cat: "Hotel 4★ · Ronda",
    name: "Hotel Catalonia Reina Victoria",
    overCat: "Reforma Interior · 88 hab. · 1906",
    loc: "Ronda, Málaga · Vistas al Tajo",
  },
  {
    idx: "07",
    img: "https://www.akmarquitectura.com/wp-content/uploads/2025/10/1.webp",
    cat: "Restauración · Valencia",
    name: "Restaurante Espolín",
    overCat: "Reforma Interior · Bar · Comedor",
    loc: "Valencia",
  },
  {
    idx: "08",
    img: "https://www.akmarquitectura.com/wp-content/uploads/2025/10/1.jpg",
    cat: "Hotel 4★ · Málaga",
    name: "Hotel Catalonia Puerta del Mar",
    overCat: "Rehabilitación · 74 hab. · s. XIX",
    loc: "Málaga · Edificios históricos",
  },
  {
    idx: "09",
    img: "https://www.akmarquitectura.com/wp-content/uploads/2023/07/C-104.jpg",
    cat: "Residencial · Eixample Barcelona",
    name: "Reforma Interior C104",
    overCat: "Reforma Integral · Plurifamiliar",
    loc: "Eixample, Barcelona",
  },
];

const stats = [
  { val: 44, label: "Años de experiencia" },
  { val: 1500, label: "Proyectos completados", pre: "+" },
  { val: 150, label: "Hoteles intervenidos", pre: "+" },
  { val: 1980, label: "Año de fundación" },
];

const heroSlides = [
  {
    img: "https://www.akmarquitectura.com/wp-content/uploads/2025/10/01.webp",
    name: "Hotel Catalonia Plaza España",
    cat: "Hotel · Madrid",
  },
  {
    img: "https://www.akmarquitectura.com/wp-content/uploads/2026/01/CC2A_1.webp",
    name: "Casa CC2A",
    cat: "Residencial · Obra Nueva",
  },
  {
    img: "https://www.akmarquitectura.com/wp-content/uploads/2024/03/00-scaled.jpg",
    name: "Hotel Catalonia Mirador des Port",
    cat: "Hotel · Menorca",
  },
  {
    img: "https://www.akmarquitectura.com/wp-content/uploads/2023/07/Barcelona-2004-Superficie-3.410m2.jpg",
    name: "Ausiàs March, 35",
    cat: "Residencial · Barcelona",
  },
  {
    img: "https://www.akmarquitectura.com/wp-content/uploads/2023/06/comerical2-1.jpg",
    name: "Hotel Catalonia Reina Victoria",
    cat: "Hotel · Ronda",
  },
  {
    img: "https://www.akmarquitectura.com/wp-content/uploads/2023/07/00-PORTADA-8-1024x1024.jpg",
    name: "Casa Olmeda",
    cat: "Residencial",
  },
];

function Index() {
  const navRef = useRef<HTMLElement | null>(null);
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
    const onScroll = () => {
      if (navRef.current) {
        navRef.current.classList.toggle("up", window.scrollY > 60);
      }
    };
    window.addEventListener("scroll", onScroll);

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
      { threshold: 0.1 },
    );
    document.querySelectorAll(".rv").forEach((el) => ob.observe(el));

    // Count up
    const counters = document.querySelectorAll<HTMLElement>(".stat-n");
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
      window.removeEventListener("scroll", onScroll);
      ob.disconnect();
      counterObserver.disconnect();
    };
  }, []);

  return (
    <>
      <nav className="akm-nav" ref={navRef}>
        <a href="#inicio" className="nav-logo">
          <img src={logo} alt="AKM Kassem & Molinero Arquitectura" />
        </a>
        <ul className="nav-links">
          <li><a href="#estudio">Estudio</a></li>
          <li><a href="#portfolio">Portfolio</a></li>
          <li><Link to="/hoteles">Hoteles</Link></li>
          <li><Link to="/residencial">Residencial</Link></li>
          <li><Link to="/equipo">Equipo</Link></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
        <MobileNavToggle />
      </nav>

      {/* HERO */}
      <section className="hero" id="inicio">
        <div className="hero-l">
          <span className="hero-label">Barcelona · Est. 1980 · +1500 Proyectos</span>
          <h1 className="hero-h1">
            Arquitectura<br />que <em>perdura</em>
          </h1>
          <p className="hero-p">
            Más de cuatro décadas transformando edificios, espacios y ciudades con rigor técnico, memoria histórica y visión contemporánea.
          </p>
          <div className="hero-scroll">
            <div className="hero-scroll-line"></div>
            <span>Desplazar</span>
          </div>
        </div>
        <div className="hero-r">
          <div className="hero-slider" aria-roledescription="carrusel">
            {heroSlides.map((s, i) => (
              <div
                key={s.img}
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
                  key={s.img}
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

      {/* MARQUEE */}
      <div className="mq-wrap">
        <div className="mq-track">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Rehabilitación", "Obra Nueva", "Hoteles", "Residencial", "Patrimonio", "Estructuras", "Interiorismo", "Restauración"].map(
              (t, i) => (
                <span className="mq-item" key={`${k}-${i}`}>
                  {t}
                  <b>·</b>
                </span>
              ),
            ),
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        {stats.map((s) => (
          <div className="stat rv" key={s.label}>
            <span className="stat-n" data-val={s.val} data-pre={s.pre || ""}>
              0
            </span>
            <span className="stat-l">{s.label}</span>
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
        <div className="about-r rv">
          <img
            src="https://www.akmarquitectura.com/wp-content/uploads/2023/07/00Logoprincipal-1024x796.jpg"
            alt="AKM Arquitectura"
          />
          <div className="about-year">
            <span className="y">1980</span>
            <span className="s">Fundación</span>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio">
        <div className="port-head">
          <div>
            <span className="eyebrow rv">Casos de éxito</span>
            <h2 className="heading rv" style={{ marginBottom: 0 }}>
              Proyectos<br />
              <em>seleccionados</em>
            </h2>
          </div>
          <span className="port-count rv">09</span>
        </div>
        <div className="pgrid">
          {projects.map((p) => (
            <div className="pc rv" key={p.idx}>
              <span className="pc-idx">{p.idx}</span>
              <img src={p.img} alt={p.name} loading="lazy" />
              <div className="pc-label">
                <p className="pc-cat">{p.cat}</p>
                <h3 className="pc-name">{p.name}</h3>
              </div>
              <div className="pc-over">
                <div className="pc-over-bar"></div>
                <p className="pc-over-cat">{p.overCat}</p>
                <h3 className="pc-over-name">{p.name}</h3>
                <p className="pc-over-loc">{p.loc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE */}
      <div className="quote-strip">
        <div className="rv">
          <blockquote>
            "Cada edificio es una conversación entre el pasado y el futuro"
          </blockquote>
          <cite>— AKM Kassem &amp; Molinero Arquitectura</cite>
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

      {/* TEAM */}
      <section className="team" id="equipo">
        <span className="eyebrow rv" style={{ display: "block", textAlign: "center" }}>
          Nuestros socios
        </span>
        <h2 className="heading rv" style={{ textAlign: "center", marginBottom: 0 }}>
          El equipo <em>detrás</em>
          <br />
          de cada proyecto
        </h2>
        <div className="tgrid">
          {team.map((m) => (
            <div className="tm rv" key={m.name}>
              <img src={m.img} alt={m.name} loading="lazy" />
              <div className="tm-label">
                <span className="tm-label-name">{m.name}</span>
              </div>
              <div className="tm-over">
                <div className="tm-over-bar"></div>
                <h3 className="tm-name">{m.name}</h3>
                <p className="tm-role">{m.role}</p>
                <p className="tm-spec" style={{ whiteSpace: "pre-line" }}>
                  {m.spec}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

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
            <div className="socials rv">
              <a
                href="https://www.instagram.com/akm_arquitectura/"
                target="_blank"
                rel="noreferrer"
                className="soc"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/akm-arquitectura/"
                target="_blank"
                rel="noreferrer"
                className="soc"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
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

      {/* FOOTER */}
      <footer className="akm-footer">
        <div className="f-top">
          <a href="#inicio" className="f-logo">
            <img src={logo} alt="AKM Kassem & Molinero Arquitectura" />
          </a>
          <div className="f-center">
            <nav className="f-nav">
              <a href="#estudio">Estudio</a>
              <a href="#portfolio">Portfolio</a>
              <Link to="/hoteles">Hoteles</Link>
              <Link to="/residencial">Residencial</Link>
              <Link to="/equipo">Equipo</Link>
              <a href="#contacto">Contacto</a>
              <Link to="/privacidad">Privacidad</Link>
              <Link to="/cookies">Cookies</Link>
              <Link to="/aviso-legal">Aviso Legal</Link>
            </nav>
          </div>
          <div className="f-right">
            <div className="f-social">
              <a href="https://www.instagram.com/akm_arquitectura/" target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a href="https://www.linkedin.com/company/akm-arquitectura/" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
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
