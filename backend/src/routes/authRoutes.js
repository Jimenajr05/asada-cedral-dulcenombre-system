/**
 * @file authRoutes.js
 * @description Rutas de la API para la autenticación (login, logout, perfil).
 */

const express = require("express");
const rateLimit = require("express-rate-limit");
const loginController = require("../controllers/loginController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * Limitador de solicitudes para mitigar ataques de fuerza bruta en el inicio de sesión.
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 solicitudes por IP
  message: { message: "Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Iniciar sesión con límite de reintentos
router.post("/login", loginLimiter, loginController);

// Cerrar sesión y limpiar cookies del navegador
router.post("/logout", (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  return res.status(200).json({ message: "Sesión cerrada exitosamente" });
});

// Obtener la información del perfil del administrador autenticado
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
