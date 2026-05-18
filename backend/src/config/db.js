/**
 * @file db.js
 * @description Configuración y establecimiento de la conexión con MongoDB usando Mongoose.
 */

const mongoose = require("mongoose");

/**
 * Conecta la aplicación con la base de datos MongoDB.
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("Conexión a la base de datos establecida");
};

module.exports = connectDB;