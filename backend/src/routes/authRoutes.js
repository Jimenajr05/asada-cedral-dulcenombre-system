const express = require("express");
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      nombre: req.user.nombre,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

module.exports = router;