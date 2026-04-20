const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const uploadGestionAgua = require("../middlewares/uploadGestionAgua");

const {
  obtenerGestionAgua,
  actualizarGestionAgua,
  subirFotoAnalisis,
  eliminarFotoAnalisis,
} = require("../controllers/gestionAguaController");

// Público
router.get("/", obtenerGestionAgua);

// Admin protegido
router.put("/", authMiddleware, actualizarGestionAgua);
router.post(
  "/analisis/foto",
  authMiddleware,
  uploadGestionAgua.single("imagen"),
  subirFotoAnalisis
);
router.delete("/analisis/foto/:fotoId", authMiddleware, eliminarFotoAnalisis);

module.exports = router;