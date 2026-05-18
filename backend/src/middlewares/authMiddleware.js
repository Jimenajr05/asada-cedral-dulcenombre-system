/**
 * @file authMiddleware.js
 * @description Middleware para verificar el token de sesión JWT del usuario y adjuntar su información a la petición.
 */

const jwt = require("jsonwebtoken");
const User = require("../models/user");

/**
 * Valida la autenticación del usuario a través de cookies o la cabecera Authorization (Bearer Token).
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para continuar con el siguiente middleware/controlador.
 * @returns {Promise<import('express').Response|void>} Continúa al siguiente middleware si es válido, o responde con error 401.
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.token ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        message: "Token no proporcionado",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "Usuario no válido",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido o expirado",
    });
  }
};

module.exports = authMiddleware;