/**
 * @file linkRoutes.js
 * @description Rutas de la API para administrar enlaces externos de interés institucional.
 */

const express = require("express");
const router = express.Router();

const {
  getLinks,
  createLink,
  updateLink,
  deleteLink
} = require("../controllers/linkController");

const auth = require("../middlewares/authMiddleware");

// Obtener todos los enlaces de interés activos (público)
router.get("/", getLinks);

// Crear un nuevo enlace (requiere autenticación)
router.post("/", auth, createLink);

// Actualizar un enlace por su ID (requiere autenticación)
router.put("/:id", auth, updateLink);

// Eliminar un enlace por su ID (requiere autenticación)
router.delete("/:id", auth, deleteLink);

module.exports = router;
