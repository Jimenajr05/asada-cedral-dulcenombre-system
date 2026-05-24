/**
 * @file avisoRoutes.js
 * @description Rutas de la API para gestionar los avisos e informativos públicos del acueducto.
 */

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  crearAviso,
  obtenerAvisos,
  obtenerAvisoPorId,
  actualizarAviso,
  eliminarAviso,
} = require("../controllers/avisoController");

// Obtener todos los avisos publicados o borradores (público)
router.get("/", obtenerAvisos);

// Obtener el detalle de un aviso por su ID
router.get("/:id", obtenerAvisoPorId);

// Crear un nuevo aviso (requiere autenticación)
router.post("/", authMiddleware, crearAviso);

// Actualizar un aviso existente por su ID (requiere autenticación)
router.put("/:id", authMiddleware, actualizarAviso);

// Eliminar un aviso por su ID (requiere autenticación)
router.delete("/:id", authMiddleware, eliminarAviso);

module.exports = router;