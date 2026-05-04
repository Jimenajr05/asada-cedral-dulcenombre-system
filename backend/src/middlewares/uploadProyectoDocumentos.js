const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

const carpetaDestino = path.join(__dirname, "../../uploads/proyectos/documentos");
if (!fs.existsSync(carpetaDestino)) fs.mkdirSync(carpetaDestino, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, carpetaDestino),
  filename:    (req, file, cb) => {
    const nombre = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, nombre);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const valido = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/.test(ext);
  valido ? cb(null, true) : cb(new Error("Tipo de archivo no permitido"));
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } });