import { coverStyle, tintStyle, type Look } from "@/lib/site-config";

type Props = {
  src: string;
  alt: string;
  look: Look;
  loading?: "eager" | "lazy";
};

/**
 * Foto de portada con el encuadre y los ajustes de /tool.
 * Devuelve la <img> y, si hay color, una capa hermana `.akm-tint`
 * (el contenedor debe tener position: relative/absolute y overflow: hidden).
 */
export function CoverImage({ src, alt, look, loading }: Props) {
  const tint = tintStyle(look);
  return (
    <>
      <img src={src} alt={alt} loading={loading} style={coverStyle(look)} />
      {tint && <span className="akm-tint" style={tint} aria-hidden="true" />}
    </>
  );
}
