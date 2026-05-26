/**
 * @file user.js
 * @description Esquema de Mongoose para representar los usuarios administradores autorizados.
 */

const mongoose = require("mongoose");

/**
 * Esquema de Mongoose para el Usuario Administrador.
 * @typedef {Object} User
 * @property {string} nombre - Nombre completo del administrador.
 * @property {string} email - Correo electrónico único para inicio de sesión.
 * @property {string} password - Contraseña cifrada con bcrypt.
 * @property {"admin"} role - Rol dentro del sistema (solo se permite "admin").
 * @property {number} failedLoginAttempts - Intentos fallidos consecutivos de login para mitigación de fuerza bruta.
 * @property {Date|null} lockUntil - Timestamp hasta el cual la cuenta está temporalmente bloqueada.
 */
const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin",
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);