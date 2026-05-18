/**
 * @file sostenibilidad.js
 * @description Esquema de Mongoose para la sección de sostenibilidad (Cultura Hídrica, Mantenimiento e Hidrantes).
 */

const mongoose = require("mongoose");

/**
 * Subesquema para almacenar imágenes de las galerías de sostenibilidad.
 * @typedef {Object} ImagenSostenibilidad
 * @property {string} src - Ruta del archivo de imagen subido.
 * @property {string} alt - Texto descriptivo para la imagen.
 */
const imagenSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { _id: false }
);

/**
 * Esquema principal de Sostenibilidad.
 * @typedef {Object} Sostenibilidad
 * @property {Object} galerias - Galerías de fotos organizadas por categoría.
 * @property {Object} galerias.culturaHidrica - Sección de eventos y educación ambiental.
 * @property {Object} galerias.mantenimiento - Acciones correctivas e inversión en tuberías y tanques.
 * @property {Object} galerias.hidrantes - Red de hidrantes comunitarios, indicando su cobertura total.
 */
const sostenibilidadSchema = new mongoose.Schema(
  {
    galerias: {
      culturaHidrica: {
        title: { type: String, default: "Actividades de Cultura Hídrica" },
        description: {
          type: String,
          default:
            "Espacio visual destinado a mostrar evidencias de actividades de educación, concientización y participación comunitaria relacionadas con el cuidado del agua.",
        },
        images: { type: [imagenSchema], default: [] },
      },
      mantenimiento: {
        title: { type: String, default: "Mantenimiento de Estructuras" },
        description: {
          type: String,
          default:
            "Registro visual de acciones de mantenimiento efectuadas en distintas estructuras del sistema de acueducto, como parte del compromiso con la sostenibilidad and el buen funcionamiento.",
        },
        images: { type: [imagenSchema], default: [] },
      },
      hidrantes: {
        title: { type: String, default: "Hidrantes Instalados" },
        description: {
          type: String,
          default:
            "La ASADA cuenta con hidrantes instalados como parte del fortalecimiento de la infraestructura y la seguridad comunitaria. A continuación se presenta un espacio visual para mostrar evidencia fotográfica.",
        },
        total: { type: String, default: "20 hidrantes instalados" },
        images: { type: [imagenSchema], default: [] },
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Sostenibilidad", sostenibilidadSchema);