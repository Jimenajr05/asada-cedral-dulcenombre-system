const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const avisoRoutes = require("./routes/avisoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/avisos", avisoRoutes);

module.exports = app;