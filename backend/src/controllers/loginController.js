/**
 * @file loginController.js
 * @description Controlador para el inicio de sesión de usuarios administradores, incluyendo control de intentos fallidos y bloqueo temporal.
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;

/**
 * Autentica un usuario administrador en el sistema.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express con email y password.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el resultado del inicio de sesión y cookie HTTP-only con el token JWT.
 */
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son obligatorios",
      });
    }

    const user = await User.findOne({ email }).select(
      "+password +failedLoginAttempts +lockUntil"
    );

    if (!user) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      const mins = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        message: `Cuenta bloqueada temporalmente. Intenta de nuevo en ${mins} minuto(s).`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
        user.failedLoginAttempts = 0;
      }

      await user.save();

      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 8 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login exitoso",
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
};

module.exports = loginController;