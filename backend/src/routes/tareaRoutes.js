const express = require("express");
const router  = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const { obtenerTareas, crearTarea, toggleCompletada, eliminarTarea } = require("../controllers/tareaController");

router.get("/",           authMiddleware, obtenerTareas);
router.post("/",          authMiddleware, crearTarea);
router.patch("/:id/toggle", authMiddleware, toggleCompletada);
router.delete("/:id",    authMiddleware, eliminarTarea);

module.exports = router;