const express = require("express");
const router = express.Router();

const sostenibilidadController = require("../controllers/sostenibilidadController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadSostenibilidad");

router.get("/", sostenibilidadController.getSostenibilidad);
router.get("/admin", authMiddleware, sostenibilidadController.getSostenibilidadAdmin);

router.put(
  "/hidrantes/total",
  authMiddleware,
  sostenibilidadController.updateTotalHidrantes
);

router.post(
  "/galerias/:galeria/imagenes",
  authMiddleware,
  upload.single("image"),
  sostenibilidadController.addImagenGaleria
);

router.put(
  "/galerias/:galeria/imagenes/:index",
  authMiddleware,
  upload.single("image"),
  sostenibilidadController.updateImagenGaleria
);

router.delete(
  "/galerias/:galeria/imagenes/:index",
  authMiddleware,
  sostenibilidadController.deleteImagenGaleria
);

module.exports = router;