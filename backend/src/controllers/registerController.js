/**
 * @file registerController.js
 * @description Controlador para registrar nuevos usuarios con rol de administrador mediante una clave de registro secreta.
 */

const bcrypt = require("bcryptjs");
const User = require("../models/user");

/**
 * Registra un nuevo usuario administrador.
 * Valida que la contraseña cumpla con criterios de seguridad y que se provea una clave de registro válida.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express con nombre, email, password y registerKey.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON indicando el éxito del registro.
 */
const registerController = async (req, res) => {
    try {
        const { nombre, email, password, registerKey } = req.body;

        if (!nombre || !email || !password || !registerKey) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios",
            });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y carácter especial",
            });
        }

        if (registerKey !== process.env.ADMIN_REGISTER_KEY) {
            return res.status(403).json({
                message: "Clave de registro inválida",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Ya existe un usuario con este correo",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            nombre,
            email,
            password: hashedPassword,
            role: "admin",
        });

        await newUser.save();

        return res.status(201).json({
            message: "Usuario administrador registrado correctamente",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al registrar el usuario",
            error: error.message,
        });
    }
};

module.exports = registerController;