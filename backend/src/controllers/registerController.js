const bcrypt = require("bcryptjs");
const User = require("../models/user");

const registerController = async (req, res) => {
    try {
        const { nombre, email, password, registerKey } = req.body;

        if (!nombre || !email || !password || !registerKey) {
            return res.status(400).json({
            message: "Todos los campos son obligatorios",
        });
        }

        // Validación de contraseña fuerte
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