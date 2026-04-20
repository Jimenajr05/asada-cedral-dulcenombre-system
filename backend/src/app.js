const express = require("express");
const cors    = require("cors");
const path    = require("path");

// Importación de rutas
const authRoutes           = require("./routes/authRoutes");
const avisoRoutes          = require("./routes/avisoRoutes");
const sobreNosotrosRoutes  = require("./routes/sobreNosotrosRoutes");
const tramiteRoutes        = require("./routes/tramiteRoutes");
const linkRoutes           = require("./routes/linkRoutes");
const transparenciaRoutes  = require("./routes/transparenciaRoutes");
const gestionAguaRoutes = require("./routes/gestionAguaRoutes");

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (Imágenes/Certificados)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Definición de rutas de la API
app.use("/api/auth",           authRoutes);
app.use("/api/avisos",         avisoRoutes);
app.use("/api/sobre-nosotros", sobreNosotrosRoutes);
app.use("/api/tramites",       tramiteRoutes);
app.use("/api/links",          linkRoutes);
app.use("/api/transparencia",  transparenciaRoutes);
app.use("/api/gestion-agua",   gestionAguaRoutes);



module.exports = app;