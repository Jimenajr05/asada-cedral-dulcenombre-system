const express = require("express");
const router = express.Router();

const authenticateToken = require("../middlewares/auth.middleware");
const vehicleController = require("../controllers/vehicle.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/", authenticateToken, vehicleController.createVehicle);
router.patch("/:id/status", authenticateToken, vehicleController.updateVehicleStatus);
 
//POST Vehiculo
router.post("/", authMiddleware, vehicleController.createVehicle);

//Marca el auto como vendido
router.patch("/:id/sold", authMiddleware, vehicleController.markAsSold);

module.exports = router;