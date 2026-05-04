const express  = require("express");
const router   = express.Router();

const authMiddleware           = require("../middlewares/authMiddleware");
const uploadProyectoFotos      = require("../middlewares/uploadProyectoFotos");
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

// Público
router.get("/",      obtenerProyectosPublico);

// Admin
router.get("/admin", authMiddleware, obtenerProyectosAdmin);
router.post("/", authMiddleware, uploadProyectoFotos.none(), crearProyecto);
router.put("/:id", authMiddleware, uploadProyectoFotos.none(), actualizarProyecto);
router.delete("/:id",authMiddleware, eliminarProyecto);

// Fotos
router.post("/:id/fotos",           authMiddleware, uploadProyectoFotos.single("imagen"),      agregarFoto);
router.delete("/:id/fotos/:fotoId", authMiddleware, eliminarFoto);

// Documentos
router.post("/:id/documentos",          authMiddleware, uploadProyectoDocumentos.single("archivo"), agregarDocumento);
router.delete("/:id/documentos/:docId", authMiddleware, eliminarDocumento);

// Actualizaciones
router.post("/:id/actualizaciones",           authMiddleware, agregarActualizacion);
router.put("/:id/actualizaciones/:actId",     authMiddleware, editarActualizacion);
router.delete("/:id/actualizaciones/:actId",  authMiddleware, eliminarActualizacion);

module.exports = router;