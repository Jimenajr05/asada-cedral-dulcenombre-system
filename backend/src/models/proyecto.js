/**
 * @file proyecto.js
 * @description Esquema de Mongoose para gestionar proyectos comunitarios e infraestructura de la ASADA.
 */

const mongoose = require("mongoose");

/**
 * Subesquema para almacenar las fotos asociadas al proyecto.
 * @typedef {Object} ProyectoFoto
 * @property {string} src - Ruta de la imagen guardada.
 * @property {string} alt - Texto descriptivo para accesibilidad.
 */
const fotoSchema = new mongoose.Schema({
  src: { type: String, required: true },
  alt: { type: String, default: "" },
});

/**
 * Subesquema para almacenar los documentos adjuntos al proyecto.
 * @typedef {Object} ProyectoDocumento
 * @property {string} nombre - Nombre del documento.
 * @property {string} url - Dirección de descarga del archivo.
 */
const documentoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  url: { type: String, required: true },
});

/**
 * Subesquema para la línea de tiempo de actualizaciones del proyecto.
 * @typedef {Object} ProyectoActualizacion
 * @property {string} texto - Contenido o avance del proyecto.
 * @property {Date} fecha - Fecha en que se registró la actualización.
 */
const actualizacionSchema = new mongoose.Schema({
  texto: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

/**
 * Esquema principal para Proyectos.
 * @typedef {Object} Proyecto
 * @property {string} titulo - Título o nombre del proyecto comunitarios (obligatorio).
 * @property {string} descripcion - Descripción general del proyecto.
 * @property {"En progreso"|"Completado"|"Pausado"|"Planificado"} estado - Estado de avance.
 * @property {ProyectoFoto[]} fotos - Colección de fotografías asociadas.
 * @property {ProyectoDocumento[]} documentos - Descargables técnicos del proyecto.
 * @property {ProyectoActualizacion[]} actualizaciones - Bitácora / Línea de tiempo de actualizaciones.
 * @property {mongoose.Types.ObjectId} creadoPor - Creador del proyecto.
 */
const proyectoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      default: "",
      trim: true,
    },
    estado: {
      type: String,
      enum: ["En progreso", "Completado", "Pausado", "Planificado"],
      default: "En progreso",
    },
    fotos: [fotoSchema],
    documentos: [documentoSchema],
    actualizaciones: [actualizacionSchema],
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Proyecto", proyectoSchema);