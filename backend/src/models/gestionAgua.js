const mongoose = require("mongoose");

const itemSimpleSchema = new mongoose.Schema(
  {
    titulo: { type: String, trim: true, default: "" },
    descripcion: { type: String, trim: true, default: "" },
    icono: { type: String, trim: true, default: "" },
  },
  { _id: true }
);

const parametroSchema = new mongoose.Schema(
  {
    nombre: { type: String, trim: true, default: "" },
    valor: { type: String, trim: true, default: "" },
    rango: { type: String, trim: true, default: "" },
    porcentaje: { type: String, trim: true, default: "" },
  },
  { _id: true }
);

const infraestructuraSchema = new mongoose.Schema(
  {
    titulo: { type: String, trim: true, default: "" },
    items: [{ type: String, trim: true }],
  },
  { _id: true }
);

const aforoRegistroSchema = new mongoose.Schema(
  {
    lugar: { type: String, trim: true, default: "" },
    produccion: { type: String, trim: true, default: "" },
  },
  { _id: true }
);

const analisisFotoSchema = new mongoose.Schema(
  {
    fecha: { type: String, trim: true, default: "" },
    imagen: { type: String, trim: true, default: "" },
  },
  { _id: true }
);

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