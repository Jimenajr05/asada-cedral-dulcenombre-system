/**
 * @file HomeData.js
 * @description Datos estáticos para la página principal (Home), incluyendo accesos rápidos destacados (trámites, avisos, contacto y gestión del agua) con sus respectivas rutas, colores y tipos de iconos, y tarjetas de pilares de la misión (calidad, mantenimiento, sostenibilidad y atención).
 */

/**
 * Accesos rápidos del panel de inicio.
 * @type {Array<Object>}
 */
export const quickAccess = [
  {
    title: "Trámites",
    subtitle: "Acceso rápido",
    icon: "file",
    bg: "bg-blue-500",
    path: "/tramites",
  },
  {
    title: "Avisos",
    subtitle: "Acceso rápido",
    icon: "bell",
    bg: "bg-orange-500",
    path: "/avisos",
  },
  {
    title: "Contacto",
    subtitle: "Acceso rápido",
    icon: "phone",
    bg: "bg-green-500",
    path: "/contacto",
  },
  {
    title: "Gestión del Agua",
    subtitle: "Acceso rápido",
    icon: "wrench",
    bg: "bg-purple-500",
    path: "/gestion-agua",
  },
];

export const missionCards = [
  {
    title: "Calidad",
    text: "Agua potable certificada",
    icon: "tint",
  },
  {
    title: "Mantenimiento",
    text: "Infraestructura moderna",
    icon: "wrench",
  },
  {
    title: "Sostenibilidad",
    text: "Gestión responsable",
    icon: "leaf",
  },
  {
    title: "Atención",
    text: "Servicio al cliente",
    icon: "phone",
  },
];