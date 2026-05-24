/**
 * @file aviso.js
 * @description Esquema de Mongoose para la colección de Avisos informativos e institucionales.
 */

const mongoose = require("mongoose");

/**
 * Esquema de Mongoose para los avisos de la ASADA.
 * @typedef {Object} Aviso
 * @property {string} titulo - Título descriptivo del aviso (obligatorio).
 * @property {string} descripcion - Contenido textual del aviso (obligatorio).
 * @property {"urgente"|"info"|"completado"} tipo - Categoría informativa del aviso.
 * @property {"publicado"|"borrador"} estado - Estado de visibilidad en el portal público.
 * @property {boolean} fijado - Indica si el aviso se mantiene anclado arriba.
 * @property {mongoose.Types.ObjectId} creadoPor - ID del usuario administrador que creó el aviso.
 * @property {string} [imagen] - URL o ruta de la imagen ilustrativa (opcional).
 */
const avisoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    tipo: {
      type: String,
      enum: ["urgente", "info", "completado"],
      default: "info",
    },
    estado: {
      type: String,
      enum: ["publicado", "borrador"],
      default: "borrador",
    },
    fijado: {
      type: Boolean,
      default: false,
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imagen: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Aviso", avisoSchema);