const express = require('express');
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicle.routes');
const app = express();

app.use(express.json());
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;