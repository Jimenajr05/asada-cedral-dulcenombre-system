const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user");
const emailService = require("../services/emailService");

// GET /api/users -> Listar todos los usuarios
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    const usersWithFlag = users.map(u => ({
      ...u.toObject(),
      isSuperAdmin: u.role === "superadmin"
    }));

    res.status(200).json({ users: usersWithFlag });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

// POST /api/users/register -> Crear un nuevo administrador
exports.createUser = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Ya existe un usuario con este correo" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generar token de verificación de 64 caracteres
    const verificationToken = crypto.randomBytes(32).toString("hex");
    // Expira en 24 horas
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newUser = new User({
      nombre,
      email,
      password: hashedPassword,
      role: "admin", // Único rol permitido
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    await newUser.save();

    // Enviar correo y esperar el resultado
    try {
      await emailService.sendVerificationEmail(newUser.email, verificationToken);
    } catch (emailError) {
      console.error("❌ [user.controller] Error al enviar el correo de verificación:", emailError.message);
      // Si falla el correo, eliminamos el usuario para evitar cuentas fantasma imposibles de verificar
      await User.findByIdAndDelete(newUser._id);

      return res.status(500).json({
        message: "No se pudo enviar el correo de verificación. Por favor revisa la configuración de SendGrid o contacta a soporte.",
        error: emailError.message
      });
    }

    res.status(201).json({
      message: "Usuario registrado. Se ha enviado un correo para verificar la cuenta.",
      user: { id: newUser._id, nombre: newUser.nombre, email: newUser.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
};

// PUT /api/users/:id -> Editar datos del usuario (excepto contraseña)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email } = req.body;

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (userToUpdate.role === "superadmin") {
      return res.status(403).json({ message: "Operación denegada: No puedes editar los datos del Administrador Principal." });
    }

    // Verificar si el email nuevo ya está en uso por otro usuario
    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: id } });
      if (emailExists) {
        return res.status(400).json({ message: "El correo electrónico ya está en uso por otro usuario" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { nombre, email } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Datos actualizados correctamente", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
  }
};

// PUT /api/users/:id/password -> Cambiar la contraseña
exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "La nueva contraseña es obligatoria" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: "La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const user = await User.findByIdAndUpdate(id, { password: hashedPassword });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar contraseña", error: error.message });
  }
};

// DELETE /api/users/:id -> Eliminar usuario (Protegiendo al último administrador y al super admin)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user && req.user._id.toString() === id) {
      return res.status(403).json({ message: "Operación denegada: No puedes eliminar tu propia cuenta mientras estás logueado." });
    }

    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (userToDelete.role === "superadmin") {
      return res.status(403).json({ message: "Operación denegada: No se puede eliminar al Administrador Principal." });
    }

    // Verificar cantidad total de usuarios
    const totalAdmins = await User.countDocuments();
    if (totalAdmins <= 1) {
      return res.status(400).json({
        message: "Operación denegada: No se puede eliminar al único administrador del sistema.",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
  }
};

// GET /api/users/verify/:token -> Verificar cuenta por token
exports.verifyUser = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }, // Verifica que no haya expirado
    });

    if (!user) {
      return res.status(400).json({ message: "El token de verificación es inválido o ha expirado." });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Redirigir al frontend al login
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/admin/login?verified=true`);
  } catch (error) {
    res.status(500).json({ message: "Error al verificar la cuenta", error: error.message });
  }
};
