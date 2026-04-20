const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const avisoRoutes = require("./routes/avisoRoutes");
const sobreNosotrosRoutes = require("./routes/sobreNosotrosRoutes");
const tramiteRoutes = require("./routes/tramiteRoutes");
const gestionAguaRoutes = require("./routes/gestionAguaRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/avisos", avisoRoutes);
app.use("/api/sobre-nosotros", sobreNosotrosRoutes);
app.use("/api/tramites", tramiteRoutes);
app.use("/api/gestion-agua", gestionAguaRoutes);

module.exports = app;