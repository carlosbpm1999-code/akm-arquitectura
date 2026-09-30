import { Link } from "@tanstack/react-router";
import wordmark from "@/assets/brand/akm-wordmark-ink.svg";

export function Footer() {
  return (
    <footer className="akm-footer">
      <div className="f-inner">
        <Link to="/" className="f-wordmark-link">
          <img src={wordmark} alt="Arqués – Kassem & Molinero Arquitectura" className="f-wordmark" />
        </Link>

        <nav className="f-nav">
          <a href="/#estudio">Estudio</a>
          <a href="/#portfolio">Portfolio</a>
          <Link to="/hoteles">Hoteles</Link>
          <Link to="/residencial">Residencial</Link>
          <Link to="/equipo">Equipo</Link>
          <Link to="/contacto">Contacto</Link>
        </nav>

        <div className="f-socials">
          <a
            href="https://www.instagram.com/akm_arquitectura/"
            target="_blank"
            rel="noreferrer"
            className="f-soc f-soc--instagram"
            aria-label="Instagram de AKM Arquitectura"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4.2" />
            </svg>
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/company/akm-arquitectura/"
            target="_blank"
            rel="noreferrer"
            className="f-soc f-soc--linkedin"
            aria-label="LinkedIn de AKM Arquitectura"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <line x1="8" y1="10" x2="8" y2="17" />
              <circle cx="8" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
              <path d="M12 17v-4.3a2.4 2.4 0 014.8 0V17" />
            </svg>
            LinkedIn
          </a>
        </div>

        <p className="f-contact">
          C/ Bailén 176, entresuelo 2a · 08037 Barcelona
          {" · "}
          <a href="tel:+34932453032">+34 932 453 032</a>
          {" · "}
          <a href="mailto:info@akmarquitectura.com">info@akmarquitectura.com</a>
        </p>
      </div>

      <div className="f-bottom">
        <span className="f-copy">© 2025 Arqués–Kassem–Molinero Associats, SLP</span>
        <div className="f-legal">
          <Link to="/privacidad">Privacidad</Link>
          <Link to="/cookies">Cookies</Link>
          <Link to="/aviso-legal">Aviso Legal</Link>
        </div>
      </div>
    </footer>
  );
}
