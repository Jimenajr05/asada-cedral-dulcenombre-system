/**
 * @file uploadSostenibilidad.js
 * @description Configuración de Multer para la carga de imágenes en las galerías de sostenibilidad (Cultura Hídrica, Mantenimiento e Hidrantes).
 */

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../../uploads/sostenibilidad");

// Crea el directorio de almacenamiento si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Almacenamiento local para imágenes de sostenibilidad.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `sostenibilidad-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

/**
 * Filtro de validación para extensiones y tipos MIME de imágenes.
 */
const fileFilter = (req, file, cb) => {
  const allowedExt = /jpg|jpeg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  const validExt = allowedExt.test(ext);
  const validMime =
    mime.includes("jpeg") ||
    mime.includes("jpg") ||
    mime.includes("png") ||
    mime.includes("webp");

  if (validExt && validMime) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes JPG, JPEG, PNG o WEBP"));
  }
};

/**
 * Instancia de Multer configurada con límite de 5MB por imagen.
 */
module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});