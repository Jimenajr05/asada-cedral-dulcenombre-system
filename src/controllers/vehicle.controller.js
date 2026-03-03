const Vehicle = require("../models/vehicle.model");

exports.createVehicle = async (req, res) => {
  try {
    const { title, brand, model, year, price, description } = req.body;

    if (!title || !brand || !model || !year || !price) {
      return res.status(400).json({
        message: "All required fields must be completed",
      });
    }

    const newVehicle = new Vehicle({
      title,
      brand,
      model,
      year,
      price,
      description,
      user: req.user.id, 
    });

    await newVehicle.save();

    res.status(201).json({
      message: "Vehicle created successfully",
      vehicle: newVehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating vehicle",
      error: error.message,
    });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    if (vehicle.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle: updatedVehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating vehicle",
      error: error.message,
    });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    if (vehicle.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Vehicle.findByIdAndDelete(id);

    res.status(200).json({
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting vehicle",
      error: error.message,
    });
  }
};

 
exports.markAsSold = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehiculo no encontrado" });
    }

    if (vehicle.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    vehicle.status = "sold";
    await vehicle.save();

    res.status(200).json({
      message: "Vehicle marked as sold",
      vehicle,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating vehicle status",
      error: error.message,
    });
  }
};