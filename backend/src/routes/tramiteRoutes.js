const express = require("express");
const router = express.Router();

const {
  crearTramite,
  getTramites,
  getTramitesAdmin,
  getTramiteById,
  updateTramite,
  deleteTramite,
} = require("../controllers/tramiteController");

const authMiddleware = require("../middlewares/authMiddleware");
const uploadTramites = require("../middlewares/uploadTramites");

router.get("/", getTramites);
router.get("/admin", authMiddleware, getTramitesAdmin);
router.get("/:id", getTramiteById);

router.post(
  "/",
  authMiddleware,
  uploadTramites.single("archivo"),
  crearTramite
);

router.put(
  "/:id",
  authMiddleware,
  uploadTramites.single("archivo"),
  updateTramite
);

router.delete("/:id", authMiddleware, deleteTramite);

module.exports = router;