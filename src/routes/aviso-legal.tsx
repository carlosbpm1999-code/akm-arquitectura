import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export const Route = createFileRoute("/aviso-legal")({
  component: LegalPage,
  head: () => ({
    meta: [
      { title: "Aviso Legal — AKM Kassem & Molinero Arquitectura" },
      {
        name: "description",
        content:
          "Aviso legal y condiciones generales de uso del sitio web de AKM Kassem & Molinero Arquitectura.",
      },
      { property: "og:title", content: "Aviso Legal — AKM Arquitectura" },
      {
        property: "og:description",
        content: "Términos y condiciones de uso de akmarquitectura.com.",
      },
    ],
  }),
});

function LegalPage() {

  useEffect(() => {
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Nav />

      <main className="cookies-page">
        <section className="cookies-hero">
          <span className="eyebrow">Información legal</span>
          <h1 className="hotels-title">Aviso Legal</h1>
          <p className="hotels-intro">
            Información general, condiciones de uso, propiedad intelectual y régimen legal aplicable al sitio web akmarquitectura.com.
          </p>
        </section>

        <section className="cookies-body">
          <article className="cookies-block">
            <h2>I. Información general</h2>
            <p>
              En cumplimiento con el deber de información dispuesto en la Ley 34/2002 de Servicios de la Sociedad de la Información y el Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos:
            </p>
            <p>
              La titularidad de este sitio web, akmarquitectura.com, la ostenta <strong>Arqués-Kassem-Molinero i Associats, SLP</strong>, con NIF B-65495616, inscrita en el Registro Mercantil de Barcelona, Hoja B-406057, Tomo 42378, Folio 129. Representante: Ali Kassem Jiha.
            </p>
            <p>
              Dirección: c/ Bailén 176, entresuelo 2a, 08037 Barcelona<br />
              Teléfono: +34 932 453 032<br />
              Email: <a href="mailto:info@akmarquitectura.com">info@akmarquitectura.com</a>
            </p>
          </article>

          <article className="cookies-block">
            <h2>II. Términos y condiciones generales de uso</h2>
            <p>
              El objeto de las presentes Condiciones es regular el acceso y la utilización del Sitio Web. Se entenderá como Sitio Web la apariencia externa de los interfaces de pantalla y todos los elementos integrados en los mismos, así como los servicios o recursos en línea que pudieran ofrecerse a los Usuarios.
            </p>
            <p>
              AKM Arquitectura se reserva la facultad de modificar, en cualquier momento y sin aviso previo, la presentación y configuración del Sitio Web y de los Contenidos y Servicios. El Usuario reconoce y acepta que en cualquier momento AKM Arquitectura pueda interrumpir, desactivar o cancelar cualquier elemento integrado en el Sitio Web.
            </p>
            <p>
              El acceso al Sitio Web es libre y, por regla general, gratuito. La utilización de algunos Contenidos o Servicios podrá hacerse mediante la suscripción o registro previo del Usuario.
            </p>
            <p>
              El acceso, navegación y uso del Sitio Web confiere la condición de Usuario, aceptando todas las Condiciones aquí establecidas. El Usuario asume su responsabilidad para realizar un uso correcto del Sitio Web, conforme a la Ley, la moral y el orden público, así como la veracidad de la información facilitada.
            </p>
            <p>
              AKM Arquitectura se reserva el derecho a retirar comentarios o aportaciones que vulneren la ley, sean discriminatorios, xenófobos, racistas, pornográficos, spam o que atenten contra la juventud, la infancia, el orden o la seguridad pública.
            </p>
            <p>
              El Usuario declara ser mayor de edad y disponer de la capacidad jurídica suficiente. Este Sitio Web no se dirige a menores de edad.
            </p>
          </article>

          <article className="cookies-block">
            <h2>III. Acceso y navegación: exclusión de garantías y responsabilidad</h2>
            <p>
              AKM Arquitectura no garantiza la continuidad, disponibilidad y utilidad del Sitio Web, ni de los Contenidos o Servicios. Hará todo lo posible por su buen funcionamiento, pero no se responsabiliza ni garantiza que el acceso sea ininterrumpido o esté libre de error.
            </p>
            <p>
              Tampoco se responsabiliza de que el contenido o software al que pueda accederse esté libre de error o cause daño al sistema informático del Usuario. En ningún caso AKM Arquitectura será responsable de las pérdidas o daños derivados del acceso, navegación y uso del Sitio Web, incluyendo los provocados por la introducción de virus.
            </p>
          </article>

          <article className="cookies-block">
            <h2>IV. Política de enlaces</h2>
            <p>
              El Sitio Web puede poner a disposición enlaces, directorios y motores de búsqueda que permiten acceder a sitios pertenecientes a terceros. Su instalación tiene por objeto facilitar al Usuario la búsqueda de información, sin que pueda considerarse una sugerencia o recomendación.
            </p>
            <p>
              AKM Arquitectura no garantiza la disponibilidad técnica, exactitud, veracidad, validez o legalidad de sitios ajenos a su propiedad, ni asume responsabilidad por los daños derivados del acceso o uso de dichos sitios.
            </p>
            <p>
              Quien realice un hipervínculo desde otro sitio al Sitio Web de AKM Arquitectura deberá saber que no se permite la reproducción —total o parcial— de los Contenidos sin autorización expresa, ni manifestaciones falsas, inexactas o incorrectas sobre el Sitio Web.
            </p>
          </article>

          <article className="cookies-block">
            <h2>V. Propiedad intelectual e industrial</h2>
            <p>
              AKM Arquitectura es titular de todos los derechos de propiedad intelectual e industrial del Sitio Web y de los elementos contenidos en el mismo (imágenes, audio, vídeo, software, textos, marcas, logotipos, combinaciones de colores, estructura y diseño). Quedan expresamente prohibidas la reproducción, distribución y comunicación pública con fines comerciales sin la autorización de AKM Arquitectura.
            </p>
            <p>
              El Usuario podrá visualizar, imprimir, copiar y almacenar los elementos del Sitio Web exclusivamente para uso personal, sin suprimir, alterar o manipular dispositivos de protección o seguridad.
            </p>
          </article>

          <article className="cookies-block">
            <h2>VI. Acciones legales, legislación aplicable y jurisdicción</h2>
            <p>
              AKM Arquitectura se reserva la facultad de presentar las acciones civiles o penales que considere necesarias por la utilización indebida del Sitio Web o por el incumplimiento de las presentes Condiciones.
            </p>
            <p>
              La relación entre el Usuario y AKM Arquitectura se regirá por la normativa vigente en territorio español. De surgir cualquier controversia, las partes someterán sus conflictos a los jueces y tribunales que correspondan conforme a derecho.
            </p>
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}