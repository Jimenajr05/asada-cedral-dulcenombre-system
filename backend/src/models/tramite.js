/**
 * @file tramite.js
 * @description Esquema de Mongoose para la gestión de trámites y solicitudes de servicio del acueducto.
 */

const mongoose = require("mongoose");

/**
 * Subesquema para almacenar la lista de requisitos.
 * @typedef {Object} RequisitoTramite
 * @property {string} texto - Descripción del requisito solicitado.
 */
const requisitoSchema = new mongoose.Schema(
  {
    texto: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

/**
 * Esquema de Mongoose para Trámite institucional.
 * @typedef {Object} Tramite
 * @property {string} titulo - Nombre o título del trámite (ej. "Paja de agua nueva").
 * @property {RequisitoTramite[]} requisitos - Colección de requisitos necesarios para iniciar la solicitud.
 * @property {string} buttonText - Texto en el botón de acción / descarga (ej. "Descargar Formulario PDF").
 * @property {string} archivoUrl - URL o ruta del archivo de formulario PDF adjunto.
 * @property {boolean} activo - Estado de habilitación para el público general.
 */
const tramiteSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    requisitos: {
      type: [requisitoSchema],
      default: [],
    },
    buttonText: {
      type: String,
      default: "Descargar Formulario",
      trim: true,
    },
    archivoUrl: {
      type: String,
      default: "",
      trim: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tramite", tramiteSchema);