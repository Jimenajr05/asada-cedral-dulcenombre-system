const mongoose = require("mongoose");

const fotoSchema = new mongoose.Schema(
  {
    titulo: String,
    seccion: String,
    url: String,
    destacada: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Foto", fotoSchema);