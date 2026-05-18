/**
 * @file uploadProyectoFotos.js
 * @description Configuración de Multer para subir fotos de la galería de avances o evidencias de proyectos comunitarios.
 */

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const carpetaDestino = path.join(__dirname, "../../uploads/proyectos/fotos");

// Crea el directorio de almacenamiento si no existe
if (!fs.existsSync(carpetaDestino)) fs.mkdirSync(carpetaDestino, { recursive: true });

/**
 * Almacenamiento local para las fotos de proyectos.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, carpetaDestino),
  filename: (req, file, cb) => {
    const nombre = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, nombre);
  },
});

/**
 * Filtro para validar formatos de imagen permitidos.
 */
const fileFilter = (req, file, cb) => {
  const valido = /jpeg|jpg|png|webp/.test(path.extname(file.originalname).toLowerCase())
    && /jpeg|jpg|png|webp/.test(file.mimetype);
  valido ? cb(null, true) : cb(new Error("Solo se permiten imágenes JPG, JPEG, PNG o WEBP"));
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });