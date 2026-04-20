import Transparencia from "../models/transparencia.model.js";

// GET TODOS
export const getAll = async (req, res) => {
  try {
    const data = await Transparencia.find({ estado: true }).sort({ fechaPublicacion: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREAR
export const create = async (req, res) => {
  try {
    const nuevo = new Transparencia({
      ...req.body,
      archivo: req.file?.path
    });

    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ELIMINAR
export const remove = async (req, res) => {
  try {
    await Transparencia.findByIdAndUpdate(req.params.id, { estado: false });
    res.json({ message: "Eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};