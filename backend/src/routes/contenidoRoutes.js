const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  getContenidos,
  getContenidoById,
  createContenido,
  updateContenido,
  toggleContenidoActivo,
  eliminarContenido,
} = require("../controllers/contenidoController");

router.get("/", getContenidos);
router.get("/:id", getContenidoById);

router.post("/", authMiddleware, createContenido);
router.put("/:id", authMiddleware, updateContenido);
router.patch("/:id/toggle", authMiddleware, toggleContenidoActivo);
router.delete("/:id", authMiddleware, eliminarContenido);

module.exports = router;