const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

const carpetaDestino = path.join(__dirname, "../../uploads/proyectos/fotos");
if (!fs.existsSync(carpetaDestino)) fs.mkdirSync(carpetaDestino, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, carpetaDestino),
  filename:    (req, file, cb) => {
    const nombre = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, nombre);
  },
});

const fileFilter = (req, file, cb) => {
  const valido = /jpeg|jpg|png|webp/.test(path.extname(file.originalname).toLowerCase())
              && /jpeg|jpg|png|webp/.test(file.mimetype);
  valido ? cb(null, true) : cb(new Error("Solo se permiten imágenes JPG, JPEG, PNG o WEBP"));
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });