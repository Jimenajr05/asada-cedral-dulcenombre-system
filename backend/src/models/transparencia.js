const mongoose = require("mongoose");

// ── Reuniones de Junta Directiva ──────────────────────────────────────────────
const reunionSchema = new mongoose.Schema(
  {
    descripcion: { type: String, required: true, trim: true },
    fecha:       { type: String, required: true, trim: true }, // ej: "Martes 6 de mayo, 2025 – 7:00 p.m."
    tipo:        { type: String, enum: ["ordinaria", "extraordinaria"], default: "ordinaria" },
  },
  { _id: true }
);

// ── Certificados (imágenes subidas) ───────────────────────────────────────────
const certificadoSchema = new mongoose.Schema(
  {
    titulo:    { type: String, required: true, trim: true },
    imagenUrl: { type: String, required: true, trim: true }, // ruta en /uploads/certificados/
  },
  { _id: true }
);

// ── Documento único de Transparencia ─────────────────────────────────────────
const transparenciaSchema = new mongoose.Schema(
  {
    reuniones:    { type: [reunionSchema],    default: [] },
    certificados: { type: [certificadoSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transparencia", transparenciaSchema);