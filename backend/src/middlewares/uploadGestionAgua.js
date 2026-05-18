/**
 * @file uploadGestionAgua.js
 * @description Configuración de Multer para la carga de imágenes relacionadas con el análisis físico-químico de la calidad del agua.
 */

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const carpetaDestino = path.join(__dirname, "../../uploads/gestion-agua");

// Crea el directorio de almacenamiento si no existe
if (!fs.existsSync(carpetaDestino)) {
  fs.mkdirSync(carpetaDestino, { recursive: true });
}

/**
 * Configuración de almacenamiento local de las fotografías de análisis.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carpetaDestino);
  },
  filename: (req, file, cb) => {
    const nombreUnico =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, nombreUnico);
  },
});

/**
 * Filtro de seguridad para validar el formato de imagen admitido.
 */
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png|webp/;
  const extensionValida = tiposPermitidos.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeValido = tiposPermitidos.test(file.mimetype);

  if (extensionValida && mimeValido) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes JPG, JPEG, PNG o WEBP"));
  }
};

/**
 * Instancia de carga configurada para imágenes de gestión de agua (límite 5MB).
 */
const uploadGestionAgua = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = uploadGestionAgua;