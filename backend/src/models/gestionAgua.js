/**
 * @file gestionAgua.js
 * @description Esquema de Mongoose para la sección de gestión del agua, calidad, aforos e infraestructura.
 */

const mongoose = require("mongoose");

/**
 * Subesquema para items informativos simples.
 * @typedef {Object} ItemSimple
 * @property {string} titulo - Título descriptivo.
 * @property {string} descripcion - Descripción corta o cuerpo.
 * @property {string} icono - Nombre del icono a mostrar.
 */
const itemSimpleSchema = new mongoose.Schema(
  {
    titulo: { type: String, trim: true, default: "" },
    descripcion: { type: String, trim: true, default: "" },
    icono: { type: String, trim: true, default: "" },
  },
  { _id: true }
);

/**
 * Subesquema para parámetros físico-químicos o de calidad.
 * @typedef {Object} ParametroCalidad
 * @property {string} nombre - Nombre del parámetro analizado.
 * @property {string} valor - Resultado obtenido.
 * @property {string} rango - Rango permitido de referencia.
 * @property {string} porcentaje - Porcentaje de cumplimiento.
 */
const parametroSchema = new mongoose.Schema(
  {
    nombre: { type: String, trim: true, default: "" },
    valor: { type: String, trim: true, default: "" },
    rango: { type: String, trim: true, default: "" },
    porcentaje: { type: String, trim: true, default: "" },
  },
  { _id: true }
);

/**
 * Subesquema para componentes de la infraestructura hidráulica.
 * @typedef {Object} InfraestructuraModulo
 * @property {string} titulo - Nombre de la infraestructura (ej. "Tanques").
 * @property {string[]} items - Lista de detalles o características.
 */
const infraestructuraSchema = new mongoose.Schema(
  {
    titulo: { type: String, trim: true, default: "" },
    items: [{ type: String, trim: true }],
  },
  { _id: true }
);

/**
 * Subesquema para el registro de aforos de nacientes.
 * @typedef {Object} AforoRegistro
 * @property {string} lugar - Nombre de la naciente.
 * @property {string} produccion - Producción de agua medida en litros/segundo.
 */
const aforoRegistroSchema = new mongoose.Schema(
  {
    lugar: { type: String, trim: true, default: "" },
    produccion: { type: String, trim: true, default: "" },
  },
  { _id: true }
);

/**
 * Subesquema para reportes fotográficos de calidad.
 * @typedef {Object} AnalisisFoto
 * @property {string} fecha - Fecha del reporte físico-químico.
 * @property {string} imagen - Ruta o enlace de la imagen cargada.
 */
const analisisFotoSchema = new mongoose.Schema(
  {
    fecha: { type: String, trim: true, default: "" },
    imagen: { type: String, trim: true, default: "" },
  },
  { _id: true }
);

/**
 * Esquema principal de Gestión del Agua de la ASADA.
 * @typedef {Object} GestionAgua
 * @property {Object} hero - Textos publicitarios y de bienvenida de la sección.
 * @property {ItemSimple[]} proceso - Pasos del ciclo de tratamiento del agua.
 * @property {ItemSimple[]} calidad - Información resumida sobre calidad.
 * @property {ParametroCalidad[]} parametros - Resultados técnicos de las pruebas de laboratorio.
 * @property {InfraestructuraModulo[]} infraestructura - Estructuras activas del acueducto.
 * @property {Object} aforos - Historial y totalización de aforos vigentes.
 * @property {Object} analisisCalidadAgua - Fotos e informes de calidad descargables.
 * @property {Object} ahorro - Consejos para el ahorro de agua (hogar e intemperie).
 */
const gestionAguaSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, trim: true, default: "" },
      subtitle: { type: String, trim: true, default: "" },
    },

    proceso: [itemSimpleSchema],

    calidad: [itemSimpleSchema],

    parametros: [parametroSchema],

    infraestructura: [infraestructuraSchema],

    aforos: {
      fecha: { type: String, trim: true, default: "" },
      registros: [aforoRegistroSchema],
      total: { type: String, trim: true, default: "" },
    },

    analisisCalidadAgua: {
      titulo: { type: String, trim: true, default: "" },
      fotos: [analisisFotoSchema],
    },

    ahorro: {
      hogar: [{ type: String, trim: true }],
      jardin: [{ type: String, trim: true }],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("GestionAgua", gestionAguaSchema);