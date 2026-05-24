/**
 * @file link.js
 * @description Esquema de Mongoose para administrar enlaces externos oficiales y de interés.
 */

const mongoose = require("mongoose");

/**
 * Esquema de Mongoose para Enlaces de Interés.
 * @typedef {Object} Link
 * @property {string} label - Nombre descriptivo o texto del enlace (ej. "Tarifas ARESEP").
 * @property {string} url - Dirección URL del destino externo.
 * @property {boolean} estado - Estado de habilitación del enlace.
 */
const linkSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  estado: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Link", linkSchema);