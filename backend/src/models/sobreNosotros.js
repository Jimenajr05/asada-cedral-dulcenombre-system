const mongoose = require("mongoose");

const miembroSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    cargo: {
      type: String,
      required: true,
      trim: true,
    },
    foto: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const coberturaSchema = new mongoose.Schema(
  {
    valor: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const sobreNosotrosSchema = new mongoose.Schema(
  {
    periodo: {
      type: String,
      default: "",
      trim: true,
    },
    miembros: {
      type: [miembroSchema],
      default: [],
    },
    cobertura: {
      type: [coberturaSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SobreNosotros", sobreNosotrosSchema);