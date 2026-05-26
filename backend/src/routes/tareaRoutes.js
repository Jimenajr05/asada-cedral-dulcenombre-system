/**
 * @file tareaRoutes.js
 * @description Rutas de la API para administrar la agenda de tareas (to-do list) de uso interno para administradores.
 */

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const { obtenerTareas, crearTarea, toggleCompletada, eliminarTarea } = require("../controllers/tareaController");

// Obtener todas las tareas creadas por el usuario autenticado (requiere autenticación)
router.get("/", authMiddleware, obtenerTareas);

// Crear una nueva tarea (requiere autenticación)
router.post("/", authMiddleware, crearTarea);

// Alternar el estado de completada de una tarea por su ID (requiere autenticación)
router.patch("/:id/toggle", authMiddleware, toggleCompletada);

// Eliminar una tarea de la lista por su ID (requiere autenticación)
router.delete("/:id", authMiddleware, eliminarTarea);

module.exports = router;
