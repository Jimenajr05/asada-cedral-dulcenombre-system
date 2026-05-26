/**
 * @file app.js
 * @description Configuración principal de la aplicación de Express, definición de middlewares de seguridad e integración de rutas API.
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

// Importación de enrutadores
const authRoutes = require("./routes/authRoutes");
const avisoRoutes = require("./routes/avisoRoutes");
const sobreNosotrosRoutes = require("./routes/sobreNosotrosRoutes");
const tramiteRoutes = require("./routes/tramiteRoutes");
const linkRoutes = require("./routes/linkRoutes");
const transparenciaRoutes = require("./routes/transparenciaRoutes");
const gestionAguaRoutes = require("./routes/gestionAguaRoutes");
const sostenibilidadRoutes = require("./routes/sostenibilidadRoutes");
const proyectoRoutes = require("./routes/proyectoRoutes");
const tareaRoutes = require("./routes/tareaRoutes");

const app = express();

// Configuración de middlewares globales
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL,
  "https://asadacedraldulcenombre.com",
  "https://asada-cedral-dulcenombre-system.onrender.com",
  "http://localhost:5173"
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Archivos estáticos públicos para imágenes y documentos cargados
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Definición de endpoints API
app.use("/api/auth", authRoutes);
app.use("/api/avisos", avisoRoutes);
app.use("/api/sobre-nosotros", sobreNosotrosRoutes);
app.use("/api/tramites", tramiteRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/transparencia", transparenciaRoutes);
app.use("/api/gestion-agua", gestionAguaRoutes);
app.use("/api/sostenibilidad", sostenibilidadRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error("❌ Error global:", err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Error interno del servidor",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

module.exports = app;