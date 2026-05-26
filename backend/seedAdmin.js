require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/user"); // Ajusta la ruta a tu modelo

const seedAdmin = async () => {
  try {
    const { DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!DATABASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error("❌ Error: Faltan variables de entorno (DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD)");
      process.exit(1);
    }

    await mongoose.connect(DATABASE_URL);
    console.log("✅ Conectado a MongoDB");

    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log("⚠️ Ya existen usuarios en el sistema. Operación cancelada para evitar duplicados.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const firstAdmin = new User({
      nombre: "Super Administrador",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "superadmin",
      isVerified: true, // El admin semilla se crea verificado directamente
    });

    await firstAdmin.save();
    console.log(`✅ Administrador creado exitosamente: ${ADMIN_EMAIL}`);

  } catch (error) {
    console.error("❌ Error ejecutando el seed:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedAdmin();
