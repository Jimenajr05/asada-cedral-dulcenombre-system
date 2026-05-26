/**
 * @file tramiteRoutes.js
 * @description Rutas de la API para administrar y tramitar descargas de formularios e información de requisitos.
 */

const express = require("express");
const router = express.Router();

const {
  crearTramite,
  getTramites,
  getTramitesAdmin,
  getTramiteById,
  updateTramite,
  deleteTramite,
} = require("../controllers/tramiteController");

const authMiddleware = require("../middlewares/authMiddleware");
const uploadTramites = require("../middlewares/uploadTramites");

// Obtener la lista de trámites activos y sus requisitos (público)
router.get("/", getTramites);

// Obtener el listado total de trámites (requiere autenticación)
router.get("/admin", authMiddleware, getTramitesAdmin);

// Obtener un trámite individual por su ID (público)
router.get("/:id", getTramiteById);

// Crear un trámite con su respectivo PDF descargable (requiere autenticación)
router.post(
  "/",
  authMiddleware,
  uploadTramites.single("archivo"),
  crearTramite
);

// Actualizar textos o reemplazar el formulario PDF de un trámite por ID (requiere autenticación)
router.put(
  "/:id",
  authMiddleware,
  uploadTramites.single("archivo"),
  updateTramite
);

// Eliminar un trámite por ID (requiere autenticación)
router.delete("/:id", authMiddleware, deleteTramite);

module.exports = router;
