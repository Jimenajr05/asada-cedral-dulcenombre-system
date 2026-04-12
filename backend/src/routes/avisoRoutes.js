const express = require("express");
const {
  getAvisos,
  getAvisoById,
  createAviso,
  updateAviso,
  deleteAviso,
} = require("../controllers/avisoController");

const router = express.Router();

router.get("/", getAvisos);
router.get("/:id", getAvisoById);
router.post("/", createAviso);
router.put("/:id", updateAviso);
router.delete("/:id", deleteAviso);

module.exports = router;