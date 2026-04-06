import {
  FaFileAlt,
  FaBell,
  FaPhoneAlt,
  FaWrench,
  FaTint,
  FaLeaf,
} from "react-icons/fa";

export const quickAccess = [
  {
    title: "Trámites",
    subtitle: "Acceso rápido",
    icon: <FaFileAlt />,
    bg: "bg-blue-500",
    path: "/tramites",
  },
  {
    title: "Avisos",
    subtitle: "Acceso rápido",
    icon: <FaBell />,
    bg: "bg-orange-500",
    path: "/avisos",
  },
  {
    title: "Contacto",
    subtitle: "Acceso rápido",
    icon: <FaPhoneAlt />,
    bg: "bg-green-500",
    path: "/contacto",
  },
  {
    title: "Gestión del Agua",
    subtitle: "Acceso rápido",
    icon: <FaWrench />,
    bg: "bg-purple-500",
    path: "/gestion-agua",
  },
];

export const notices = [
  {
    title: "Corte de agua programado",
    date: "10 Feb 2026",
    desc: "Se realizarán trabajos de mantenimiento el próximo domingo de 8:00 AM a 2:00 PM.",
    urgent: true,
  },
  {
    title: "Nuevos horarios de atención",
    date: "05 Feb 2026",
    desc: "Horario: lunes a viernes de 1:00 PM a 5:00 PM.",
    urgent: false,
  },
  {
    title: "Campaña de ahorro de agua",
    date: "01 Feb 2026",
    desc: "Únete a nuestra campaña comunitaria de ahorro de agua.",
    urgent: false,
  },
];

export const missionCards = [
  {
    title: "Calidad",
    text: "Agua potable certificada",
    icon: <FaTint />,
  },
  {
    title: "Mantenimiento",
    text: "Infraestructura moderna",
    icon: <FaWrench />,
  },
  {
    title: "Sostenibilidad",
    text: "Gestión responsable",
    icon: <FaLeaf />,
  },
  {
    title: "Atención",
    text: "Servicio al cliente",
    icon: <FaPhoneAlt />,
  },
];