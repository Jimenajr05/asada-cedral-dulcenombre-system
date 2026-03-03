const express = require('express');
const app = express();

app.use(express.json());

const vehicleRoutes = require('./routes/vehicle.routes');

app.use('/api/vehicles', vehicleRoutes);

module.exports = app;