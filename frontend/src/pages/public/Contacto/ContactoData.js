/**
 * @file ContactoData.js
 * @description Datos estáticos para la sección de Contacto, incluyendo la información de ubicación física, números telefónicos institucionales, WhatsApp, correos electrónicos, horarios oficiales, teléfonos de emergencias por fugas y opciones del formulario de consulta.
 */

/**
 * Contenido principal de la sección Hero (título y subtítulo).
 * @type {Object}
 * @property {string} title - Título del banner.
 * @property {string} subtitle - Subtítulo descriptivo.
 */
export const hero = {
  title: "Contacto",
  subtitle: "Estamos aquí para ayudarte.",
};

export const contactInfo = {
  direccion: [
    "Comunidades de Cedral y Dulce Nombre",
    "Quesada, San Carlos, Alajuela",
  ],
  telefonos: [
    "Oficina: 2460-9775",
    "WhatsApp: 8497-6556",
    "Emergencias: 8494-8777",
  ],
  correos: ["acedraldn@ice.co.cr"],
  horario: [
    "Lunes a Viernes",
    "1:00 PM - 5:00 PM",
    "Sábados y domingos cerrado",
  ],
  emergencia: {
    titulo: "Emergencias",
    descripcion:
      "Para reportar fugas o problemas urgentes fuera del horario de oficina:",
    telefono: "8494-8777",
  },
  mapaLink: "https://maps.app.goo.gl/44S8Kq5Y9M9qb821A",
};

export const formOptions = [
  "Seleccione un asunto",
  "Consulta general",
  "Reporte de avería",
  "Trámites",
  "Facturación",
  "Otro",
];