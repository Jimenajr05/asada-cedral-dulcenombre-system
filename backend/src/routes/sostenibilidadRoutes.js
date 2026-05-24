/**
 * @file sostenibilidadRoutes.js
 * @description Rutas de la API para administrar las galerías de Cultura Hídrica, Mantenimiento y red de Hidrantes.
 */

const express = require("express");
const router = express.Router();

const sostenibilidadController = require("../controllers/sostenibilidadController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadSostenibilidad");

// Obtener la información de sostenibilidad pública (público)
router.get("/", sostenibilidadController.getSostenibilidad);

// Obtener la información completa incluyendo datos adicionales (requiere autenticación)
router.get("/admin", authMiddleware, sostenibilidadController.getSostenibilidadAdmin);

// Actualizar el número de hidrantes totales (requiere autenticación)
router.put(
  "/hidrantes/total",
  authMiddleware,
  sostenibilidadController.updateTotalHidrantes
);

// Agregar una foto a una de las galerías de sostenibilidad (requiere autenticación)
router.post(
  "/galerias/:galeria/imagenes",
  authMiddleware,
  upload.single("image"),
  sostenibilidadController.addImagenGaleria
);

// Editar el alt o reemplazar la foto por su índice de imagen (requiere autenticación)
router.put(
  "/galerias/:galeria/imagenes/:index",
  authMiddleware,
  upload.single("image"),
  sostenibilidadController.updateImagenGaleria
);

// Eliminar una imagen de una galería por su índice (requiere autenticación)
router.delete(
  "/galerias/:galeria/imagenes/:index",
  authMiddleware,
  sostenibilidadController.deleteImagenGaleria
);

module.exports = router;