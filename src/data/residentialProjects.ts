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
      "Rehabilitación integral de un edificio plurifamiliar del Eixample barcelonés (1888–1890), recuperando elementos originales y modernizando viviendas e instalaciones.",
    description: [
      "Rehabilitación integral de un edificio plurifamiliar del Eixample barcelonés, levantado entre 1888 y 1890. La intervención recupera la fachada protegida, refuerza la estructura original y reordena las viviendas para adaptarlas a estándares actuales de habitabilidad.",
      "El proyecto combina la conservación de elementos patrimoniales —pavimentos hidráulicos, carpinterías y molduras— con la actualización completa de instalaciones, accesibilidad y eficiencia energética.",
    ],
    images: [ausias00, ausias01, ausias03, ausias04, ausias05],
  },
  {
    slug: "reforma-interior-c104",
    name: "Reforma Interior C104",
    meta: "Eixample, Barcelona · Reforma integral",
    summary:
      "Reforma integral de una vivienda en el Eixample con una nueva organización espacial diáfana, materiales nobles y máxima entrada de luz natural.",
    description: [
      "Reforma integral de una vivienda situada en una finca clásica del Eixample. El proyecto reorganiza el programa para liberar la zona de día hacia la fachada principal y agrupar las estancias privadas en un núcleo compacto.",
      "Materiales naturales, carpinterías a medida y una iluminación cuidada definen un interior contemporáneo respetuoso con la arquitectura original del edificio.",
    ],
    images: [c104_1, c104_2, c104_3, c104_4, c104_5],
  },
  {
    slug: "ronda-universitat-35",
    name: "Ronda Universitat 35",
    meta: "Barcelona · Rehabilitación",
    summary:
      "Rehabilitación de un edificio histórico en Ronda Universitat: restauración de fachada y zonas comunes, y modernización de viviendas conservando el carácter del inmueble.",
    description: [
      "Rehabilitación de un edificio histórico en una de las arterias más representativas de Barcelona. La intervención restaura la fachada protegida y los elementos comunes —escalera, vestíbulo y patios— recuperando su valor original.",
      "En las viviendas se actualizan instalaciones, distribución y acabados, manteniendo techos, carpinterías y pavimentos singulares allí donde resulta posible.",
    ],
    images: [ronda01, ronda02, ronda03, ronda04, ronda05],
  },
  {
    slug: "vallcorba-6",
    name: "Vallcorba 6",
    meta: "Vivienda unifamiliar · Reforma",
    summary:
      "Reforma de una vivienda unifamiliar centrada en la conexión interior–exterior, con espacios fluidos, paleta neutra y una nueva relación con el jardín.",
    description: [
      "Reforma integral de una vivienda unifamiliar que reorganiza la planta baja en torno a un gran espacio de día abierto al jardín. La intervención prioriza la luz natural y la continuidad visual entre estancias.",
      "El proyecto introduce una paleta sobria de materiales —madera, piedra y blancos cálidos— y carpinterías de gran formato que difuminan el límite entre interior y exterior.",
    ],
    images: [vallcorba01, vallcorba02, vallcorba03],
  },
  {
    slug: "casa-cristo",
    name: "Casa Cristo",
    meta: "Vivienda unifamiliar",
    summary:
      "Vivienda unifamiliar concebida como una sucesión de espacios serenos, articulados por un patio central que organiza la vida doméstica.",
    description: [
      "Casa Cristo se organiza en torno a un patio central que actúa como corazón de la vivienda, distribuyendo luz y conectando visualmente las distintas estancias.",
      "Volúmenes contenidos, materiales nobles y una relación cuidadosa con el entorno definen una arquitectura doméstica calmada, pensada para la vida cotidiana.",
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
    meta: "Obra nueva · 5 plantas · Vistas al mar",
    summary:
      "Vivienda unifamiliar de obra nueva en cinco plantas, con piscina, gimnasio y sauna, diseñada para maximizar las vistas al mar.",
    description: [
      "Vivienda unifamiliar de obra nueva desarrollada en cinco plantas. El programa incluye cinco dormitorios, gimnasio, sauna y piscina, distribuidos para optimizar la luz natural y las vistas al mar.",
      "La organización vertical permite separar zonas de servicio, día y descanso, mientras que la cubierta se concibe como una terraza panorámica abierta al horizonte.",
    ],
    images: [cc2a1, cc2a2, cc2a3, cc2a4, cc2a5, cc2a6],
  },
  {
    slug: "granja-del-pas",
    name: "Granja del Pas",
    meta: "Rehabilitación rural",
    summary:
      "Rehabilitación de una antigua granja transformada en vivienda, manteniendo la esencia constructiva original y adaptándola a un uso contemporáneo.",
    description: [
      "Rehabilitación de una antigua construcción rural reconvertida en vivienda. El proyecto preserva los muros de piedra, las cubiertas de madera y la geometría original de la edificación.",
      "En el interior se introduce un programa doméstico contemporáneo con instalaciones nuevas, aislamiento y carpinterías eficientes, respetando la atmósfera del edificio preexistente.",
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
