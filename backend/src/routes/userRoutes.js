const express = require("express");
const rateLimit = require("express-rate-limit");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Limitador estricto para creación de usuarios (5 solicitudes cada 15 min por IP)
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Demasiadas solicitudes de registro. Intenta de nuevo en 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

// RUTA PÚBLICA (Colocar ANTES de authMiddleware)
router.get("/verify/:token", userController.verifyUser);

// Todas las rutas de usuarios requieren estar autenticado
router.use(authMiddleware);

// Rutas CRUD
router.get("/", userController.getUsers);
router.post("/register", registerLimiter, userController.createUser);
router.put("/:id", userController.updateUser);
router.put("/:id/password", userController.updatePassword);
router.delete("/:id", userController.deleteUser);

module.exports = router;
