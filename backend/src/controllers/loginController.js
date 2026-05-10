const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutos

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

    // Mensaje genérico para no revelar si el email existe
    if (!user) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    // Verificar bloqueo temporal
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const mins = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        message: `Cuenta bloqueada temporalmente. Intenta de nuevo en ${mins} minuto(s).`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Incrementar intentos fallidos
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

    // Login exitoso — resetear intentos
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

    // Enviar token en cookie httpOnly
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000, // 8 horas
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