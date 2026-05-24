/**
 * @file gestionAguaRoutes.js
 * @description Rutas de la API para administrar los parámetros de calidad del agua, aforos e infraestructura.
 */

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

// Obtener toda la información de la sección de calidad y gestión del agua (público)
router.get("/", obtenerGestionAgua);

// Actualizar textos y métricas principales (requiere autenticación)
router.put("/", authMiddleware, actualizarGestionAgua);

// Subir una nueva fotografía o informe de análisis de calidad (requiere autenticación)
router.post(
  "/analisis/foto",
  authMiddleware,
  uploadGestionAgua.single("imagen"),
  subirFotoAnalisis
);

// Eliminar un análisis de calidad físico-químico por ID de la foto (requiere autenticación)
router.delete("/analisis/foto/:fotoId", authMiddleware, eliminarFotoAnalisis);

module.exports = router;