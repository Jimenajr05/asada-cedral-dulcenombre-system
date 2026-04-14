const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(__dirname, "../../uploads/fotos");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const extensionesValidas = [".jpg", ".jpeg", ".png", ".webp"];
  const extension = path.extname(file.originalname).toLowerCase();

  const tiposValidos = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (
    extensionesValidas.includes(extension) &&
    tiposValidos.includes(file.mimetype)
  ) {
    return cb(null, true);
  }

  cb(new Error("Solo se permiten imágenes JPG, JPEG, PNG o WEBP"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;