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

router.get("/", getSobreNosotros);
router.put("/", authMiddleware, updateSobreNosotros);

router.post("/miembros", authMiddleware, upload.single("foto"), addMiembro);
router.put("/miembros/:index", authMiddleware, upload.single("foto"), updateMiembro);
router.delete("/miembros/:index", authMiddleware, deleteMiembro);

router.post("/cobertura", authMiddleware, addCobertura);
router.put("/cobertura/:index", authMiddleware, updateCobertura);
router.delete("/cobertura/:index", authMiddleware, deleteCobertura);

module.exports = router;