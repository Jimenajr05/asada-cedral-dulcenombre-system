const express    = require("express");
const router     = express.Router();
const auth       = require("../middlewares/authMiddleware");
const uploadCert = require("../middlewares/uploadCertificados");

const {
  getTransparencia,
  addReunion,
  updateReunion,
  deleteReunion,
  addCertificado,
  deleteCertificado,
} = require("../controllers/transparenciaController");

// ── Público ──────────────────────────────────────────────────────────────────
router.get("/", getTransparencia);

// ── Reuniones (protegido) ────────────────────────────────────────────────────
router.post("/reuniones",     auth, addReunion);
router.put("/reuniones/:id",  auth, updateReunion);
router.delete("/reuniones/:id", auth, deleteReunion);

// ── Certificados (protegido) ─────────────────────────────────────────────────
router.post("/certificados",      auth, uploadCert.single("imagen"), addCertificado);
router.delete("/certificados/:id", auth, deleteCertificado);

module.exports = router;