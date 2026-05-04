import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import logo from "@/assets/akm-logo.png";
import { MobileNavToggle } from "@/components/MobileNavToggle";
import { teamMembers, type TeamMember } from "@/data/team";

export const Route = createFileRoute("/equipo/")({
  component: TeamPage,
  head: () => ({
    meta: [
      { title: "Equipo — AKM Kassem & Molinero Arquitectura" },
      {
        name: "description",
        content:
          "Conoce al equipo de socios de AKM Arquitectura: arquitectos con más de cuatro décadas de experiencia en rehabilitación, hoteles, residencial y patrimonio en Barcelona.",
      },
      { property: "og:title", content: "Equipo — AKM Arquitectura" },
      {
        property: "og:description",
        content:
          "Socios y arquitectos del estudio AKM Kassem & Molinero, Barcelona.",
      },
    ],
  }),
});

function TeamPage() {
  const navRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState<TeamMember | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const dragStartY = useRef<number | null>(null);
  const dragDeltaY = useRef<number>(0);
  const dragStartTime = useRef<number>(0);
  const lastMoveY = useRef<number>(0);
  const lastMoveTime = useRef<number>(0);
  const dragVelocity = useRef<number>(0); // px/ms, positive = downward
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const closeWithAnimation = () => {
    setIsClosing(true);
    // Let the CSS transition play before unmounting
    window.setTimeout(() => {
      setIsClosing(false);
      setDragY(0);
      setActive(null);
    }, 220);
  };

  const isTouchDevice = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(hover: none), (pointer: coarse)").matches;

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    const y = e.touches[0].clientY;
    const t = performance.now();
    dragStartY.current = y;
    dragDeltaY.current = 0;
    dragStartTime.current = t;
    lastMoveY.current = y;
    lastMoveTime.current = t;
    dragVelocity.current = 0;
    setIsDragging(true);
  };
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (dragStartY.current == null) return;
    const y = e.touches[0].clientY;
    const t = performance.now();
    const dy = y - dragStartY.current;
    dragDeltaY.current = dy;
    const dt = t - lastMoveTime.current;
    if (dt > 0) {
      // Smooth velocity with a simple low-pass filter
      const instant = (y - lastMoveY.current) / dt;
      dragVelocity.current = dragVelocity.current * 0.6 + instant * 0.4;
    }
    lastMoveY.current = y;
    lastMoveTime.current = t;
    // Only react to downward drag; apply mild rubber-banding
    if (dy > 0) {
      const eased = dy < 200 ? dy : 200 + (dy - 200) * 0.35;
      setDragY(eased);
    } else {
      setDragY(0);
    }
  };
  const onTouchEnd = () => {
    const dy = dragDeltaY.current;
    const v = dragVelocity.current; // px/ms
    dragStartY.current = null;
    dragDeltaY.current = 0;
    setIsDragging(false);
    // Thresholds relative to viewport so it feels consistent on phones/tablets/desktop.
    const vh =
      typeof window !== "undefined"
        ? window.innerHeight || 800
        : 800;
    const distanceThreshold = Math.max(80, Math.min(180, vh * 0.18));
    // A flick: fast downward motion (>0.6 px/ms ≈ 600 px/s) with at least a small drag.
    const isFlick = v > 0.6 && dy > 24;
    if (dy > distanceThreshold || isFlick) {
      closeWithAnimation();
    } else {
      // Snap back smoothly
      setDragY(0);
    }
    dragVelocity.current = 0;
  };

  const onMediaClick = () => {
    if (isTouchDevice()) closeWithAnimation();
  };

  useEffect(() => {
    const onScroll = () => {
      navRef.current?.classList.toggle("up", window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!active) return;
    // Shallow URL sync so the modal state is shareable / back-button friendly
    const prevUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const targetUrl = `/equipo/${active.slug}`;
    if (prevUrl !== targetUrl) {
      window.history.pushState({ tmModal: active.slug }, "", targetUrl);
    }
    const onPop = () => setActive(null);
    window.addEventListener("popstate", onPop);
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = (): HTMLElement[] => {
      const root = modalRef.current;
      if (!root) return [];
      const selector =
        'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
      return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
      );
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const idx = teamMembers.findIndex((x) => x.name === active.name);
        if (idx === -1) return;
        const delta = e.key === "ArrowRight" ? 1 : -1;
        const next = teamMembers[(idx + delta + teamMembers.length) % teamMembers.length];
        e.preventDefault();
        setActive(next);
        requestAnimationFrame(() => closeBtnRef.current?.focus());
        return;
      }
      if (e.key === "Tab") {
        const focusable = getFocusable();
        if (focusable.length === 0) {
          e.preventDefault();
          closeBtnRef.current?.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const activeEl = document.activeElement as HTMLElement | null;
        const inModal = modalRef.current?.contains(activeEl ?? null);
        if (!inModal) {
          e.preventDefault();
          first.focus();
          return;
        }
        if (e.shiftKey && activeEl === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && activeEl === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // focus close button for keyboard users
    requestAnimationFrame(() => closeBtnRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
      window.removeEventListener("popstate", onPop);
      // Restore URL if we still own the pushed entry
      if (window.history.state?.tmModal) {
        window.history.back();
      }
    };
  }, [active]);

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
          <li><a href="/#contacto">Contacto</a></li>
        </ul>
        <MobileNavToggle />
      </nav>

      <main className="team-page">
        <section className="team-hero">
          <span className="eyebrow">Nuestros socios</span>
          <h1 className="hotels-title">
            El equipo <em>detrás</em>
            <br />
            de cada proyecto
          </h1>
          <p className="hotels-intro">
            Cinco arquitectos socios lideran el estudio desde Barcelona, sumando una trayectoria que arranca en 1980. Compartimos una misma manera de entender el oficio: rigor técnico, escucha al cliente y respeto por el lugar.
          </p>
        </section>

        <section className="team-grid-section">
          <div className="tgrid">
            {teamMembers.map((m) => (
              <button
                type="button"
                className="tm tm-button"
                key={m.name}
                onClick={() => setActive(m)}
                aria-label={`Ver biografía de ${m.name}`}
              >
                <img
                  src={m.img}
                  srcSet={m.srcSet}
                  sizes="(max-width: 720px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  alt={m.name}
                  width={640}
                  height={960}
                  loading="lazy"
                  decoding="async"
                />
                <div className="tm-label">
                  <span className="tm-label-name">{m.name}</span>
                  <span className="tm-label-role">{m.role}</span>
                </div>
                <div className="tm-over">
                  <div className="tm-over-bar"></div>
                  <h3 className="tm-name">{m.name}</h3>
                  <p className="tm-role">{m.role}</p>
                  <p className="tm-spec" style={{ whiteSpace: "pre-line" }}>
                    {m.spec}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {active && (
        <div
          className="tm-modal-backdrop"
          data-closing={isClosing ? "true" : undefined}
          style={{
            // Fade backdrop with the drag distance
            opacity: isClosing ? 0 : Math.max(0, 1 - dragY / 400),
            transition: isDragging ? "none" : "opacity 220ms ease",
          }}
          onClick={() => closeWithAnimation()}
        >
          <div
            className="tm-modal"
            ref={modalRef}
            data-closing={isClosing ? "true" : undefined}
            style={{
              transform: isClosing
                ? "translateY(100vh)"
                : dragY > 0
                  ? `translateY(${dragY}px)`
                  : undefined,
              transition: isDragging
                ? "none"
                : "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tm-modal-name"
            aria-describedby={active.bio ? "tm-modal-bio" : "tm-modal-spec"}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}
          >
            <button
              ref={closeBtnRef}
              type="button"
              className="tm-modal-close"
              onClick={() => setActive(null)}
              aria-label="Cerrar"
            >
              <span aria-hidden="true">×</span>
            </button>
            <div
              className="tm-modal-media"
              onClick={onMediaClick}
              role={isTouchDevice() ? "button" : undefined}
              aria-label={isTouchDevice() ? "Cerrar" : undefined}
            >
              <img
                src={active.img}
                srcSet={active.srcSet}
                sizes="(max-width: 720px) 100vw, 480px"
                alt={active.name}
                width={640}
                height={960}
                decoding="async"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <div className="tm-modal-body">
              <span className="eyebrow">{active.role}</span>
              <h2 id="tm-modal-name" className="tm-modal-name">{active.name}</h2>
              <p id="tm-modal-spec" className="tm-modal-spec" style={{ whiteSpace: "pre-line" }}>
                {active.spec}
              </p>
              {active.bio && (
                <p id="tm-modal-bio" className="tm-modal-bio">{active.bio}</p>
              )}
              <div className="tm-modal-actions">
                <Link
                  to="/equipo/$slug"
                  params={{ slug: active.slug }}
                  className="tm-modal-cta"
                >
                  Ver página completa
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <Link to="/equipo">Equipo</Link>
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