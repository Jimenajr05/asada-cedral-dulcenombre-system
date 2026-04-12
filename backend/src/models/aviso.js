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
      required: true,
      enum: ["urgente", "informacion", "completado"],
      default: "informacion",
    },
    fecha: {
      type: Date,
      required: true,
      default: Date.now,
    },
    destacado: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("Aviso", avisoSchema);