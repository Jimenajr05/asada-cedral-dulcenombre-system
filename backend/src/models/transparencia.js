/**
 * @file transparencia.js
 * @description Esquema de Mongoose para la sección de Transparencia (reuniones de junta/asambleas, certificados y reconocimientos oficiales).
 */

const mongoose = require("mongoose");

/**
 * Subesquema para el registro de sesiones y reuniones.
 * @typedef {Object} ReunionTransparencia
 * @property {string} descripcion - Resumen o título del acta de la reunión.
 * @property {string} fecha - Fecha en que se llevó a cabo.
 * @property {"ordinaria"|"extraordinaria"} tipo - Tipo de sesión.
 */
const reunionSchema = new mongoose.Schema(
  {
    descripcion: { type: String, required: true, trim: true },
    fecha: { type: String, required: true, trim: true },
    tipo: { type: String, enum: ["ordinaria", "extraordinaria"], default: "ordinaria" },
  },
  { _id: true }
);

/**
 * Subesquema para almacenar certificados oficiales y premios de la ASADA.
 * @typedef {Object} CertificadoTransparencia
 * @property {string} titulo - Título oficial del galardón.
 * @property {string} imagenUrl - Ruta de la imagen ilustrativa del certificado.
 */
const certificadoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    imagenUrl: { type: String, required: true, trim: true },
  },
  { _id: true }
);

/**
 * Esquema principal de Transparencia.
 * @typedef {Object} Transparencia
 * @property {ReunionTransparencia[]} reuniones - Historial de reuniones de la Junta Directiva o Asamblea.
 * @property {CertificadoTransparencia[]} certificados - Reconocimientos de calidad y gestión ambiental obtenidos.
 */
const transparenciaSchema = new mongoose.Schema(
  {
    reuniones: { type: [reunionSchema], default: [] },
    certificados: { type: [certificadoSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transparencia", transparenciaSchema);