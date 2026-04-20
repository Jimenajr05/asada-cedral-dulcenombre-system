const express = require("express");
const router = express.Router();

const {
  getLinks,
  createLink,
  updateLink
} = require("../controllers/linkController");

const auth = require("../middlewares/authMiddleware");

// público
router.get("/", getLinks);

// privado
router.post("/", auth, createLink);
router.put("/:id", auth, updateLink);

module.exports = router;