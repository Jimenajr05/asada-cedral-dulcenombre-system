const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const avisoRoutes = require("./routes/avisoRoutes");
const fotoRoutes = require("./routes/fotoRoutes");
const contenidoRoutes = require("./routes/contenidoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/avisos", avisoRoutes);
app.use("/api/fotos", fotoRoutes);
app.use("/api/contenidos", contenidoRoutes);

module.exports = app;