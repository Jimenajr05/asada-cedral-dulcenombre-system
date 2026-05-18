/**
 * @file uploadTramites.js
 * @description Configuración de Multer para la carga de archivos adjuntos y formularios descargables en la sección de trámites.
 */

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(__dirname, "../../uploads/tramites");

// Crea el directorio de almacenamiento si no existe
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

/**
 * Almacenamiento local para formularios y archivos de trámites.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

/**
 * Instancia configurada de Multer para archivos de trámites (máx. 10MB).
 */
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = upload;