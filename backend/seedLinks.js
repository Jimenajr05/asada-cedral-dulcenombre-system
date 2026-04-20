// seed-links.js
// Ejecutar UNA sola vez: node seed-links.js
// Crea los links de Asamblea y Financieros en la BD si no existen.

require("dotenv").config();
const mongoose = require("mongoose");
const Link     = require("./src/models/link");

const LINKS_INICIALES = [
  {
    label:  "Informe de Asamblea",
    url:    "https://drive.google.com/drive/folders/REEMPLAZAR_CON_LINK_REAL",
    estado: true,
  },
  {
    label:  "Estados Financieros",
    url:    "https://drive.google.com/drive/folders/REEMPLAZAR_CON_LINK_REAL",
    estado: true,
  },
  {
    label:  "Tarifas (ARESEP)",
    url:    "https://aresep.go.cr/agua-potable/tarifas/",
    estado: true,
  },
];

const seed = async () => {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("✅ Conectado a MongoDB");

  for (const link of LINKS_INICIALES) {
    const existe = await Link.findOne({ label: link.label });
    if (existe) {
      console.log(`⏭️  Ya existe: "${link.label}"`);
    } else {
      await Link.create(link);
      console.log(`✅ Creado: "${link.label}"`);
    }
  }

  await mongoose.disconnect();
  console.log("🏁 Listo.");
};

seed().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});