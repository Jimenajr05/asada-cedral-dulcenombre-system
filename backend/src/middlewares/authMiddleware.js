const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
    try {
      // Leer token de cookie httpOnly o header Authorization (compatibilidad)
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