import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-3.jpg";
import team4 from "@/assets/team-4.jpg";
import team5 from "@/assets/team-5.jpg";

export type TeamMember = {
  img: string;
  name: string;
  role: string;
  spec: string;
  bio?: string;
};

export const teamMembers: TeamMember[] = [
  {
    img: team1,
    name: "Clara Español",
    role: "Socia",
    spec: "Arquitecta · UPC",
    bio: "Aporta una mirada sensible al detalle constructivo y a la integración del proyecto en su contexto, con especial dedicación a la rehabilitación residencial.",
  },
  {
    img: team2,
    name: "Ali Kassem",
    role: "Socio",
    spec: "Arquitecto · UPC\nEspecialista en estructuras",
    bio: "Lidera el área técnica y estructural del estudio, garantizando soluciones eficientes en proyectos de obra nueva y rehabilitación de gran complejidad.",
  },
  {
    img: team3,
    name: "Jacinto Arqués",
    role: "Socio Fundador",
    spec: "Arquitecto · UPC",
    bio: "Cofundador del estudio en 1980, ha dirigido durante más de cuatro décadas proyectos de patrimonio, hoteles y obra residencial en Barcelona.",
  },
  {
    img: team4,
    name: "Alberto Sarmiento",
    role: "Socio",
    spec: "Arquitecto · UPC\nPostgrado en Rehabilitación",
    bio: "Especializado en rehabilitación de edificios catalogados, combina rigor técnico con respeto por la memoria material de cada intervención.",
  },
  {
    img: team5,
    name: "Julián Molinero",
    role: "Socio Fundador",
    spec: "Arquitecto · UPC",
    bio: "Cofundador del estudio, su trayectoria une la práctica arquitectónica con una visión cultural del oficio, presente en cada proyecto del despacho.",
  },
];