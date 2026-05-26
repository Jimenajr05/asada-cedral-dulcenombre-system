/**
 * @file proyectoRoutes.js
 * @description Rutas de la API para la gestión de proyectos comunitarios, infraestructura de acueducto y línea de tiempo.
 */

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const uploadProyectoFotos = require("../middlewares/uploadProyectoFotos");
const uploadProyectoDocumentos = require("../middlewares/uploadProyectoDocumentos");

const {
  obtenerProyectosPublico,
  obtenerProyectosAdmin,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto,
  agregarFoto,
  eliminarFoto,
  agregarDocumento,
  eliminarDocumento,
  agregarActualizacion,
  editarActualizacion,
  eliminarActualizacion,
} = require("../controllers/proyectoController");

// Obtener proyectos (público)
router.get("/", obtenerProyectosPublico);

// Obtener todos los proyectos incluyendo no visibles/borradores (requiere autenticación)
router.get("/admin", authMiddleware, obtenerProyectosAdmin);

// Crear un nuevo proyecto vacío/base (requiere autenticación)
router.post("/", authMiddleware, uploadProyectoFotos.none(), crearProyecto);

// Actualizar campos principales de un proyecto por su ID (requiere autenticación)
router.put("/:id", authMiddleware, uploadProyectoFotos.none(), actualizarProyecto);

// Eliminar un proyecto por su ID (requiere autenticación)
router.delete("/:id", authMiddleware, eliminarProyecto);

// Agregar una foto a la galería de avances del proyecto (requiere autenticación)
router.post("/:id/fotos", authMiddleware, uploadProyectoFotos.single("imagen"), agregarFoto);

// Eliminar una foto de la galería de avances (requiere autenticación)
router.delete("/:id/fotos/:fotoId", authMiddleware, eliminarFoto);

// Adjuntar un documento o plano técnico al proyecto (requiere autenticación)
router.post("/:id/documentos", authMiddleware, uploadProyectoDocumentos.single("archivo"), agregarDocumento);

// Eliminar un documento del proyecto (requiere autenticación)
router.delete("/:id/documentos/:docId", authMiddleware, eliminarDocumento);

// Agregar una actualización en la bitácora/línea de tiempo (requiere autenticación)
router.post("/:id/actualizaciones", authMiddleware, agregarActualizacion);

// Editar una actualización existente en la bitácora (requiere autenticación)
router.put("/:id/actualizaciones/:actId", authMiddleware, editarActualizacion);

// Eliminar una actualización en la bitácora (requiere autenticación)
router.delete("/:id/actualizaciones/:actId", authMiddleware, eliminarActualizacion);

module.exports = router;
