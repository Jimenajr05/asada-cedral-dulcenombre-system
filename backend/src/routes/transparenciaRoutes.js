/**
 * @file transparenciaRoutes.js
 * @description Rutas de la API para la sección de transparencia institucional, actas de reuniones y galardones.
 */

const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const uploadCert = require("../middlewares/uploadCertificados");

const {
  getTransparencia,
  addReunion,
  updateReunion,
  deleteReunion,
  addCertificado,
  updateCertificado,
  deleteCertificado,
} = require("../controllers/transparenciaController");

// Obtener toda la información de transparencia (público)
router.get("/", getTransparencia);

// Agregar una reunión/asamblea en transparencia (requiere autenticación)
router.post("/reuniones", auth, addReunion);

// Actualizar los datos de una reunión/asamblea por ID (requiere autenticación)
router.put("/reuniones/:id", auth, updateReunion);

// Eliminar una reunión/asamblea de la lista por su ID (requiere autenticación)
router.delete("/reuniones/:id", auth, deleteReunion);

// Agregar un certificado o galardón con imagen (requiere autenticación)
router.post("/certificados", auth, uploadCert.single("imagen"), addCertificado);

// Actualizar título o reemplazar la imagen de un certificado por ID (requiere autenticación)
router.put("/certificados/:id", auth, uploadCert.single("imagen"), updateCertificado);

// Eliminar un certificado de la base de datos por su ID (requiere autenticación)
router.delete("/certificados/:id", auth, deleteCertificado);

module.exports = router;