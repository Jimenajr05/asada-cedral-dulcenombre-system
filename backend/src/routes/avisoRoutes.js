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

router.get("/", obtenerAvisos);
router.get("/:id", obtenerAvisoPorId);

router.post("/", authMiddleware, crearAviso);
router.put("/:id", authMiddleware, actualizarAviso);
router.delete("/:id", authMiddleware, eliminarAviso);

module.exports = router;