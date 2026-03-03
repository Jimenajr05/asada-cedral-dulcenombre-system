const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

// Verificar que exista el header y tenga formato Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token requerido" });
    }

// Extraer tokens
    const token = authHeader.replace("Bearer ", "");

// Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

// Buscar usuario en la base de datos
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Token inválido - Usuario no existe" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = authMiddleware;