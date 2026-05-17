const express = require("express");
const router = express.Router();

const {
  getLinks,
  createLink,
  updateLink,
  deleteLink
} = require("../controllers/linkController");

const auth = require("../middlewares/authMiddleware");

// público
router.get("/", getLinks);

// privado
router.post("/", auth, createLink);
router.put("/:id", auth, updateLink);
router.delete("/:id", auth, deleteLink);

module.exports = router;