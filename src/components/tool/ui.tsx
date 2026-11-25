import { useEffect, useId, useState, type ReactNode } from "react";

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  neutral,
  unit = "",
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  neutral: number;
  unit?: string;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const id = useId();
  const changed = value !== neutral;
  return (
    <div className="tl-slider">
      <div className="tl-slider-head">
        <label htmlFor={id}>{label}</label>
        <span className="tl-slider-val">
          {format ? format(value) : `${value}${unit}`}
          <button
            type="button"
            className="tl-reset"
            onClick={() => onChange(neutral)}
            disabled={!changed}
            title="Volver al valor original"
            aria-label={`Restablecer ${label}`}
          >
            ↺
          </button>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onDoubleClick={() => onChange(neutral)}
      />
    </div>
  );
}

export function Field({
  label,
  hint,
  value,
  placeholder,
  maxLength,
  multiline,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
  onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <div className="tl-field">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={4}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && <p className="tl-hint">{hint}</p>}
    </div>
  );
}

export function Section({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="tl-section">
      <header className="tl-section-head">
        <h3>{title}</h3>
        {aside}
      </header>
      {children}
    </section>
  );
}

export type Notice = { kind: "ok" | "error"; text: string } | null;

/** Mensaje de estado que desaparece solo (los de éxito). */
export function useNotice() {
  const [notice, setNotice] = useState<Notice>(null);
  useEffect(() => {
    if (notice?.kind !== "ok") return;
    const t = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(t);
  }, [notice]);
  return [notice, setNotice] as const;
}

export function NoticeBar({ notice }: { notice: Notice }) {
  if (!notice) return null;
  return (
    <p className={`tl-notice tl-notice--${notice.kind}`} role={notice.kind === "error" ? "alert" : "status"}>
      {notice.text}
    </p>
  );
}

export const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—";
