/**
 * @file uploadCertificados.js
 * @description Configuración de Multer para la carga de certificados y reconocimientos oficiales en la sección de transparencia.
 */

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(__dirname, "../../uploads/certificados");

// Crea el directorio de almacenamiento si no existe
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

/**
 * Almacenamiento en disco para certificados subidos.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

/**
 * Filtro para validar formato de imagen del certificado.
 */
const fileFilter = (req, file, cb) => {
  const validExts = [".jpg", ".jpeg", ".png", ".webp"];
  const validMimes = ["image/jpeg", "image/png", "image/webp"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (validExts.includes(ext) && validMimes.includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error("Solo se permiten imágenes JPG, JPEG, PNG o WEBP"));
};

/**
 * Instancia configurada de Multer para imágenes de certificados (máx. 5MB).
 */
const uploadCertificados = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = uploadCertificados;