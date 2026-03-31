const express = require("express");
const router = express.Router();

const upload = require("../config/upload");
const authMiddleware = require("../middlewares/authMiddleware");

const {
  crearFoto,
  getFotos,
  getFotoById,
  updateFoto,
  toggleDestacada,
  deleteFoto,
} = require("../controllers/fotoController");

router.get("/", getFotos);
router.get("/:id", getFotoById);

router.post("/", authMiddleware, upload.single("imagen"), crearFoto);
router.put("/:id", authMiddleware, upload.single("imagen"), updateFoto);
router.patch("/:id/destacar", authMiddleware, toggleDestacada);
router.delete("/:id", authMiddleware, deleteFoto);

module.exports = router;