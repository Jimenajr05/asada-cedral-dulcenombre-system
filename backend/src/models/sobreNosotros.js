/**
 * @file sobreNosotros.js
 * @description Esquema de Mongoose para la sección institucional "Sobre Nosotros" (período de gestión, junta directiva y estadísticas de cobertura).
 */

const mongoose = require("mongoose");

/**
 * Subesquema para representar a los miembros de la junta directiva.
 * @typedef {Object} MiembroDirectiva
 * @property {string} nombre - Nombre completo del miembro.
 * @property {string} cargo - Cargo que ocupa en la junta directiva (ej. "Presidente", "Tesorero").
 * @property {string} foto - Ruta de la fotografía del miembro.
 */
const miembroSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    cargo: {
      type: String,
      required: true,
      trim: true,
    },
    foto: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

/**
 * Subesquema para las estadísticas y cifras de cobertura del servicio.
 * @typedef {Object} CoberturaEstadistica
 * @property {string} valor - Valor numérico o porcentual de la cobertura (ej. "98%", "3000").
 * @property {string} descripcion - Etiqueta descriptiva del dato (ej. "Hogares abastecidos").
 */
const coberturaSchema = new mongoose.Schema(
  {
    valor: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

/**
 * Esquema principal "Sobre Nosotros".
 * @typedef {Object} SobreNosotros
 * @property {string} periodo - Periodo de vigencia de la junta directiva actual (ej. "2024 - 2026").
 * @property {MiembroDirectiva[]} miembros - Listado de miembros de la junta directiva.
 * @property {CoberturaEstadistica[]} cobertura - Estadísticas representativas del acueducto.
 */
const sobreNosotrosSchema = new mongoose.Schema(
  {
    periodo: {
      type: String,
      default: "",
      trim: true,
    },
    miembros: {
      type: [miembroSchema],
      default: [],
    },
    cobertura: {
      type: [coberturaSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SobreNosotros", sobreNosotrosSchema);