import mongoose from "mongoose";

const transparenciaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: String,
  tipo: {
    type: String,
    enum: ["financiero", "acta", "reglamento", "otro"],
    default: "otro"
  },
  archivo: String, // ruta del archivo
  link: String,
  fechaPublicacion: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model("Transparencia", transparenciaSchema);