/**
 * @file sobreNosotrosRoutes.js
 * @description Rutas de la API para administrar la sección de "Sobre Nosotros", junta directiva y estadísticas.
 */

const express = require("express");
const router = express.Router();

const {
  getSobreNosotros,
  updateSobreNosotros,
  addMiembro,
  updateMiembro,
  deleteMiembro,
  addCobertura,
  updateCobertura,
  deleteCobertura,
} = require("../controllers/sobreNosotrosController");

const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

// Obtener la información institucional completa (público)
router.get("/", getSobreNosotros);

// Actualizar el periodo de vigencia de la junta (requiere autenticación)
router.put("/", authMiddleware, updateSobreNosotros);

// Agregar un nuevo miembro a la junta directiva con su foto (requiere autenticación)
router.post("/miembros", authMiddleware, upload.single("foto"), addMiembro);

// Actualizar datos o foto de un miembro existente por índice (requiere autenticación)
router.put("/miembros/:index", authMiddleware, upload.single("foto"), updateMiembro);

// Eliminar a un miembro de la junta por su índice (requiere autenticación)
router.delete("/miembros/:index", authMiddleware, deleteMiembro);

// Agregar un registro estadístico de cobertura (requiere autenticación)
router.post("/cobertura", authMiddleware, addCobertura);

// Actualizar un registro de cobertura por su índice (requiere autenticación)
router.put("/cobertura/:index", authMiddleware, updateCobertura);

// Eliminar un registro de cobertura por su índice (requiere autenticación)
router.delete("/cobertura/:index", authMiddleware, deleteCobertura);

module.exports = router;