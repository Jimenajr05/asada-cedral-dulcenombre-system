/**
 * @file seedLinks.js
 * @description Script independiente para sembrar (seed) los enlaces institucionales iniciales en la base de datos MongoDB.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Link = require("./src/models/link");

/**
 * Listado inicial de enlaces de interés.
 * @type {Array<Object>}
 */
const LINKS_INICIALES = [
  {
    label: "Informe de Asamblea",
    url: "https://drive.google.com/drive/folders/REEMPLAZAR_CON_LINK_REAL",
    estado: true,
  },
  {
    label: "Estados Financieros",
    url: "https://drive.google.com/drive/folders/REEMPLAZAR_CON_LINK_REAL",
    estado: true,
  },
  {
    label: "Tarifas (ARESEP)",
    url: "https://aresep.go.cr/agua-potable/tarifas/",
    estado: true,
  },
];

/**
 * Conecta con la base de datos, verifica si los enlaces existen y los crea si no están presentes.
 * @async
 * @function seed
 * @returns {Promise<void>}
 */
const seed = async () => {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("Conectado a MongoDB");

  for (const link of LINKS_INICIALES) {
    const existe = await Link.findOne({ label: link.label });
    if (existe) {
      console.log(`Ya existe: "${link.label}"`);
    } else {
      await Link.create(link);
      console.log(`Creado: "${link.label}"`);
    }
  }

  await mongoose.disconnect();
  console.log("Listo.");
};

seed().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});