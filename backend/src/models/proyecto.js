const mongoose = require("mongoose");

const fotoSchema = new mongoose.Schema({
  src: { type: String, required: true },
  alt: { type: String, default: "" },
});

const documentoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  url:    { type: String, required: true },
});

const actualizacionSchema = new mongoose.Schema({
  texto: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

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
    fotos:          [fotoSchema],
    documentos:     [documentoSchema],
    actualizaciones:[actualizacionSchema],
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Proyecto", proyectoSchema);