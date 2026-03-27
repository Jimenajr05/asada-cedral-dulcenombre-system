const mongoose = require("mongoose");

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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Aviso", avisoSchema);