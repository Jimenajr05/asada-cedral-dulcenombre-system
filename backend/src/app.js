const express      = require("express");
const cors         = require("cors");
const path         = require("path");
const helmet       = require("helmet");
const cookieParser = require("cookie-parser");

// Importación de rutas
const authRoutes           = require("./routes/authRoutes");
const avisoRoutes          = require("./routes/avisoRoutes");
const sobreNosotrosRoutes  = require("./routes/sobreNosotrosRoutes");
const tramiteRoutes        = require("./routes/tramiteRoutes");
const linkRoutes           = require("./routes/linkRoutes");
const transparenciaRoutes  = require("./routes/transparenciaRoutes");
const gestionAguaRoutes    = require("./routes/gestionAguaRoutes");
const sostenibilidadRoutes = require("./routes/sostenibilidadRoutes");
const proyectoRoutes       = require("./routes/proyectoRoutes");
const tareaRoutes = require("./routes/tareaRoutes");

const app = express();

// Middlewares de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // permite cargar imágenes desde el frontend
}));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Servir archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Definición de rutas de la API
app.use("/api/auth",           authRoutes);
app.use("/api/avisos",         avisoRoutes);
app.use("/api/sobre-nosotros", sobreNosotrosRoutes);
app.use("/api/tramites",       tramiteRoutes);
app.use("/api/links",          linkRoutes);
app.use("/api/transparencia",  transparenciaRoutes);
app.use("/api/gestion-agua",   gestionAguaRoutes);
app.use("/api/sostenibilidad", sostenibilidadRoutes);
app.use("/api/proyectos",      proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

module.exports = app;