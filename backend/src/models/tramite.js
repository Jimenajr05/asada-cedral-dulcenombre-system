const mongoose = require("mongoose");

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