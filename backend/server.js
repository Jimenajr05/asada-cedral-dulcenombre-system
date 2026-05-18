/**
 * @file server.js
 * @description Punto de entrada principal (entrypoint) del servidor backend. Conecta a la base de datos e inicia la escucha HTTP.
 */

require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 4000;

/**
 * Conecta la base de datos e inicia la escucha de peticiones HTTP en el puerto configurado.
 * @async
 * @function startServer
 * @returns {Promise<void>}
 */
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
};

startServer();