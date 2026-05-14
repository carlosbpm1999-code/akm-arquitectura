import ausias00 from "@/assets/residencial/ausias-march-35/00.webp";
import ausias01 from "@/assets/residencial/ausias-march-35/01.webp";
import ausias03 from "@/assets/residencial/ausias-march-35/03.webp";
import ausias04 from "@/assets/residencial/ausias-march-35/04.webp";
import ausias05 from "@/assets/residencial/ausias-march-35/05.webp";

import c104_1 from "@/assets/residencial/c104/1.jpg";
import c104_2 from "@/assets/residencial/c104/2.jpg";
import c104_3 from "@/assets/residencial/c104/3.jpg";
import c104_4 from "@/assets/residencial/c104/4.jpg";
import c104_5 from "@/assets/residencial/c104/5.jpg";

import ronda01 from "@/assets/residencial/ronda-universidad-35/01.webp";
import ronda02 from "@/assets/residencial/ronda-universidad-35/02.webp";
import ronda03 from "@/assets/residencial/ronda-universidad-35/03.jpg";
import ronda04 from "@/assets/residencial/ronda-universidad-35/04.jpg";
import ronda05 from "@/assets/residencial/ronda-universidad-35/05.jpg";

import vallcorba01 from "@/assets/residencial/vallcorba-6/01.jpg";
import vallcorba02 from "@/assets/residencial/vallcorba-6/02.jpg";
import vallcorba03 from "@/assets/residencial/vallcorba-6/03.jpg";

import cristo01 from "@/assets/residencial/casa-cristo/01.webp";
import cristo02 from "@/assets/residencial/casa-cristo/02.jpg";
import cristo03 from "@/assets/residencial/casa-cristo/03.jpg";

import olmeda1 from "@/assets/residencial/casa-olmeda/1.jpg";
import olmeda2 from "@/assets/residencial/casa-olmeda/2.jpg";
import olmeda3 from "@/assets/residencial/casa-olmeda/3.jpg";

import cc2a1 from "@/assets/residencial/unifamiliar-cc2a/1.jpg";
import cc2a2 from "@/assets/residencial/unifamiliar-cc2a/2.jpg";
import cc2a3 from "@/assets/residencial/unifamiliar-cc2a/3.jpg";
import cc2a4 from "@/assets/residencial/unifamiliar-cc2a/4.jpg";
import cc2a5 from "@/assets/residencial/unifamiliar-cc2a/5.jpg";
import cc2a6 from "@/assets/residencial/unifamiliar-cc2a/6.jpg";

import granja1 from "@/assets/residencial/granja-del-pas/vista 1.webp";
import granja2 from "@/assets/residencial/granja-del-pas/vista 2.webp";
import granja3 from "@/assets/residencial/granja-del-pas/vista 3.webp";
import granja4 from "@/assets/residencial/granja-del-pas/vista 4.webp";

import ocana01 from "@/assets/residencial/casa-ocana/01.jpg";
import ocana02 from "@/assets/residencial/casa-ocana/02.jpg";
import ocana03 from "@/assets/residencial/casa-ocana/03.jpg";

export type ResidentialProject = {
  slug: string;
  name: string;
  meta: string;
  summary: string;
  description: string[];
  images: string[];
};

export const residentialProjects: ResidentialProject[] = [
  {
    slug: "ausias-march-35",
    name: "Ausiàs March 35",
    meta: "Barcelona · 2004 · 3.410 m²",
    summary:
      "Reforma y ampliación de un edificio ecléctico de inspiración modernista de los años 1888-90, adaptado para uso residencial conservando sus valores patrimoniales.",
    description: [
      "Reforma y ampliación de un edificio ecléctico de inspiración modernista de los años 1888-90.",
      "El inmueble fue adaptado para su nuevo uso de viviendas, conservando sus valores patrimoniales característicos. Se proyectó una remonta con el consiguiente aumento de superficie, así como la rehabilitación integral de todo el inmueble.",
    ],
    images: [ausias00, ausias01, ausias03, ausias04, ausias05],
  },
  {
    slug: "reforma-interior-c104",
    name: "Reforma Interior C104",
    meta: "Barcelona · 2021–2022",
    summary:
      "Reforma integral de un conjunto de viviendas en un edificio plurifamiliar del Eixample, con foco en funcionalidad, luminosidad y conservación del carácter original.",
    description: [
      "El proyecto consiste en la reforma integral de un conjunto de viviendas de un edificio plurifamiliar situado en el Eixample de Barcelona. La propuesta busca actualizar esta tipología residencial clásica, dotándola de mayor funcionalidad, luminosidad y confort para responder a las necesidades contemporáneas.",
      "La intervención se centra en optimizar las distribuciones, mejorar la relación entre estancias y potenciar la entrada de luz natural, sin perder el carácter singular de la arquitectura original, reutilizando materiales originales como la baldosa del suelo hidráulico.",
    ],
    images: [c104_1, c104_2, c104_3, c104_4, c104_5],
  },
  {
    slug: "ronda-universitat-35",
    name: "Ronda Universitat 35",
    meta: "Barcelona · 1999 · 2.240 m²",
    summary:
      "Rehabilitación integral y cambio de uso a viviendas de alto standing de un edificio histórico en Ronda Universitat, anteriormente sede bancaria.",
    description: [
      "El edificio, que antiguamente albergaba la sede del Banco Occidental hasta 1970 y luego fue ocupado por la Banca Catalana para oficinas, fue objeto de una propuesta de rehabilitación integral y cambio de uso a viviendas de alto standing.",
      "Se tuvieron que reconstruir las tribunas reproduciendo las del edificio gemelo existente. Todo esto hizo que su rehabilitación y ampliación de la planta ático resultase de una complejidad técnica y estructural considerable.",
    ],
    images: [ronda04, ronda01, ronda02, ronda03, ronda05],
  },
  {
    slug: "vallcorba-6",
    name: "Vallcorba 6",
    meta: "Sabadell · 2010 · 1.600 m²",
    summary:
      "Rehabilitación integral de un edificio industrial en Sabadell reconvertido en edificio plurifamiliar, con anexión de la finca vecina.",
    description: [
      "Proyecto de rehabilitación integral de edificio existente de uso industrial para destinarlo a edificio plurifamiliar de viviendas. Se anexionó a la finca vecina, manteniendo de un lado la volumetría actual y resolviendo la comunicación vertical y horizontal necesaria para acceder a la distribución de los espacios interiores.",
      "Para afectar a las dos fincas fue necesaria la tramitación de una modificación puntual del Plan General, MPG-28, del Ayuntamiento de Sabadell.",
    ],
    images: [vallcorba01, vallcorba02, vallcorba03],
  },
  {
    slug: "casa-cristo",
    name: "Casa Cristo",
    meta: "Corbera de Llobregat · 2005 · 258 m²",
    summary:
      "Vivienda unifamiliar aislada articulada a partir de un muro de contención de geometría circular que integra el volumen en la pendiente suroeste.",
    description: [
      "Proyecto de obra nueva para vivienda unifamiliar aislada. El concepto de distribución se desarrolla a partir de un muro de contención de geometría circular que encara el edificio a la vertiente de la pendiente suroeste, integrando el volumen en el terreno existente.",
      "Los exteriores toman protagonismo al establecer un diálogo a través de los retranqueos de fachada conectado con los espacios interiores.",
    ],
    images: [cristo01, cristo02, cristo03],
  },
  {
    slug: "casa-olmeda",
    name: "Casa Olmeda",
    meta: "Vivienda unifamiliar",
    summary:
      "Vivienda unifamiliar de líneas contemporáneas que dialoga con el paisaje a través de grandes aperturas y una marcada horizontalidad.",
    description: [
      "Casa Olmeda se asienta en su parcela buscando vistas y orientación óptima. El programa se desarrolla en una composición horizontal de volúmenes que se abren al exterior mediante ventanales de gran formato.",
      "El interior despliega una paleta cálida y materiales naturales que refuerzan el carácter doméstico y la integración con el entorno.",
    ],
    images: [olmeda1, olmeda2, olmeda3],
  },
  {
    slug: "casa-cc2a",
    name: "Casa CC2A",
    meta: "Barcelona · 2024 · 715 m²",
    summary:
      "Obra nueva de vivienda unifamiliar en 5 plantas diseñada para aprovechar al máximo la luz natural y las vistas panorámicas sobre la ciudad y el mar.",
    description: [
      "Obra nueva de vivienda unifamiliar construida en 5 plantas, diseñada para aprovechar al máximo la luz natural y las vistas panorámicas sobre la ciudad y el mar.",
      "La vivienda se organiza en diferentes niveles según uso: un amplio aparcamiento con capacidad para 4 vehículos; una planta dedicada al bienestar y al encuentro social con gimnasio, bar y sauna; una generosa zona de día que integra salón, comedor y cocina en un único espacio abierto hacia el exterior donde se encuentra la espectacular piscina desbordante que se funde visualmente con el horizonte. Por último, en las dos plantas superiores, la zona de noche, con cinco dormitorios dobles con baño propio y unas vistas privilegiadas.",
    ],
    images: [cc2a1, cc2a2, cc2a3, cc2a4, cc2a5, cc2a6],
  },
  {
    slug: "granja-del-pas",
    name: "Granja del Pas",
    meta: "Sabadell · 2001 · 32.839 m²",
    summary:
      "Gran conjunto residencial en Sabadell con 32.839 m² de edificación, 10.093 m² de zona ajardinada y 6.300 m² de locales comerciales.",
    description: [
      "Gran conjunto residencial en Sabadell compuesto por edificación de 32.839,80 m², zona ajardinada de 10.092,90 m² y 6.300 m² de locales comerciales.",
    ],
    images: [granja1, granja2, granja3, granja4],
  },
  {
    slug: "casa-ocana",
    name: "Casa Ocaña",
    meta: "Vivienda unifamiliar",
    summary:
      "Vivienda unifamiliar que combina volúmenes sobrios y materiales naturales para crear un hogar luminoso y profundamente conectado con su entorno.",
    description: [
      "Casa Ocaña se plantea como una secuencia de volúmenes sencillos articulados por patios y aperturas estratégicas, garantizando luz natural y ventilación cruzada en todas las estancias.",
      "El uso de materiales locales, una envolvente eficiente y un interior de paleta neutra construyen un hogar atemporal pensado para durar.",
    ],
    images: [ocana01, ocana02, ocana03],
  },
];

export function getResidentialProject(slug: string) {
  return residentialProjects.find((project) => project.slug === slug);
}
