export type ResidentialProject = {
  slug: string;
  name: string;
  meta: string;
  summary: string;
  description: string[];
  image: string;
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
    image:
      "https://www.akmarquitectura.com/wp-content/uploads/2023/07/Barcelona-2004-Superficie-3.410m2-1024x1024.jpg",
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
    image:
      "https://www.akmarquitectura.com/wp-content/uploads/2023/07/C-104-1024x1024.jpg",
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
    image:
      "https://www.akmarquitectura.com/wp-content/uploads/2023/07/RU-35-1024x1024.jpg",
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
    image:
      "https://www.akmarquitectura.com/wp-content/uploads/2023/06/08_Vallcorba-6-3.jpg",
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
    image:
      "https://www.akmarquitectura.com/wp-content/uploads/2023/06/04_Casa-Cristo-1-1024x1024.jpg",
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
    image:
      "https://www.akmarquitectura.com/wp-content/uploads/2023/07/00-PORTADA-8-1024x1024.jpg",
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
    image:
      "https://www.akmarquitectura.com/wp-content/uploads/2026/01/CC2A_1-1024x689.webp",
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
    image:
      "https://www.akmarquitectura.com/wp-content/uploads/2023/07/04-16-1024x746.jpg",
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
    image:
      "https://www.akmarquitectura.com/wp-content/uploads/2023/07/00-PORTADA-11-1024x1024.jpg",
  },
];

export function getResidentialProject(slug: string) {
  return residentialProjects.find((project) => project.slug === slug);
}