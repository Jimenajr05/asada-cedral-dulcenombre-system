const jwt = require("jsonwebtoken");
const User = require("../models/user"); 

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.token ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ message: "No autorizado: Token no proporcionado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "No autorizado: Usuario no válido" });
    }

    // Como todos son admin, no verificamos el rol. Solo asignamos el usuario a la request.
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "No autorizado: Token inválido o expirado" });
  }
};

module.exports = authMiddleware;
