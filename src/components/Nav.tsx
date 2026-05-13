import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import logo from "@/assets/brand/akm-wordmark-ink.svg";
import { MobileNavToggle } from "./MobileNavToggle";

export function Nav() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      ref.current?.classList.toggle("up", window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="akm-nav" ref={ref}>
      <Link to="/" className="nav-logo">
        <img src={logo} alt="AKM Kassem & Molinero Arquitectura" />
      </Link>

      <div className="nav-right">
        <ul className="nav-links">
          <li><a href="/#estudio">Estudio</a></li>
          <li><a href="/#portfolio">Portfolio</a></li>
          <li><Link to="/hoteles">Hoteles</Link></li>
          <li><Link to="/residencial">Residencial</Link></li>
          <li><Link to="/equipo">Equipo</Link></li>
          <li><a href="/contacto">Contacto</a></li>
        </ul>
        <MobileNavToggle />
      </div>
    </nav>
  );
}
