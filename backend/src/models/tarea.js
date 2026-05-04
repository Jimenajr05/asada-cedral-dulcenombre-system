const mongoose = require("mongoose");

const tareaSchema = new mongoose.Schema(
  {
    texto: {
      type: String,
      required: true,
      trim: true,
    },
    prioridad: {
      type: String,
      enum: ["alta", "media", "baja"],
      default: "media",
    },
    completada: {
      type: Boolean,
      default: false,
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tarea", tareaSchema);