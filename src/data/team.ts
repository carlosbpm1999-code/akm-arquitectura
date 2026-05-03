import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-3.jpg";
import team4 from "@/assets/team-4.jpg";
import team5 from "@/assets/team-5.jpg";

// Responsive sources generated at build time by vite-imagetools.
// Widths cover ~2-col mobile (≈360px CSS), 3-col tablet (≈340px CSS) and
// 5-col desktop (≈260px CSS) at 1x/2x DPR.
import team1Set from "@/assets/team-1.jpg?w=320;480;640;960&format=webp&as=srcset";
import team2Set from "@/assets/team-2.jpg?w=320;480;640;960&format=webp&as=srcset";
import team3Set from "@/assets/team-3.jpg?w=320;480;640;960&format=webp&as=srcset";
import team4Set from "@/assets/team-4.jpg?w=320;480;640;960&format=webp&as=srcset";
import team5Set from "@/assets/team-5.jpg?w=320;480;640;960&format=webp&as=srcset";

export type TeamMember = {
  slug: string;
  img: string;
  srcSet: string;
  name: string;
  role: string;
  spec: string;
  bio?: string;
};

export const teamMembers: TeamMember[] = [
  {
    slug: "clara-espanol",
    img: team1,
    srcSet: team1Set,
    name: "Clara Español",
    role: "Socia",
    spec: "Arquitecta · UPC",
    bio: "Aporta una mirada sensible al detalle constructivo y a la integración del proyecto en su contexto, con especial dedicación a la rehabilitación residencial.",
  },
  {
    slug: "ali-kassem",
    img: team2,
    srcSet: team2Set,
    name: "Ali Kassem",
    role: "Socio",
    spec: "Arquitecto · UPC\nEspecialista en estructuras",
    bio: "Lidera el área técnica y estructural del estudio, garantizando soluciones eficientes en proyectos de obra nueva y rehabilitación de gran complejidad.",
  },
  {
    slug: "jacinto-arques",
    img: team3,
    srcSet: team3Set,
    name: "Jacinto Arqués",
    role: "Socio Fundador",
    spec: "Arquitecto · UPC",
    bio: "Cofundador del estudio en 1980, ha dirigido durante más de cuatro décadas proyectos de patrimonio, hoteles y obra residencial en Barcelona.",
  },
  {
    slug: "alberto-sarmiento",
    img: team4,
    srcSet: team4Set,
    name: "Alberto Sarmiento",
    role: "Socio",
    spec: "Arquitecto · UPC\nPostgrado en Rehabilitación",
    bio: "Especializado en rehabilitación de edificios catalogados, combina rigor técnico con respeto por la memoria material de cada intervención.",
  },
  {
    slug: "julian-molinero",
    img: team5,
    srcSet: team5Set,
    name: "Julián Molinero",
    role: "Socio Fundador",
    spec: "Arquitecto · UPC",
    bio: "Cofundador del estudio, su trayectoria une la práctica arquitectónica con una visión cultural del oficio, presente en cada proyecto del despacho.",
  },
];

export const getTeamMember = (slug: string) =>
  teamMembers.find((m) => m.slug === slug);