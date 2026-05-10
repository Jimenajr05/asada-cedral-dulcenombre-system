const express = require("express");
const rateLimit = require("express-rate-limit");
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Rate limiter para login — máx 10 intentos por IP cada 15 min
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", registerController);
router.post("/login", loginLimiter, loginController);

// Logout — limpiar cookie httpOnly
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Sesión cerrada exitosamente" });
});

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