import { useEffect, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";

type LinkItem =
  | { type: "anchor"; href: string; label: string }
  | { type: "route"; to: string; label: string };

const LINKS: LinkItem[] = [
  { type: "anchor", href: "/#estudio", label: "Estudio" },
  { type: "anchor", href: "/#portfolio", label: "Portfolio" },
  { type: "route", to: "/hoteles", label: "Hoteles" },
  { type: "route", to: "/residencial", label: "Residencial" },
  { type: "anchor", href: "/#equipo", label: "Equipo" },
  { type: "anchor", href: "/#contacto", label: "Contacto" },
];

export function MobileNavToggle() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const unsub = router.subscribe("onLoad", () => setOpen(false));
    return () => unsub();
  }, [router]);

  return (
    <>
      <button
        type="button"
        className={`nav-burger${open ? " is-open" : ""}`}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`mobile-nav-panel${open ? " is-open" : ""}`} role="dialog" aria-modal="true">
        <ul className="mobile-nav-list">
          {LINKS.map((item) =>
            item.type === "anchor" ? (
              <li key={item.label}>
                <a href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ) : (
              <li key={item.label}>
                <Link to={item.to} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
    </>
  );
}