const Tarea = require("../models/tarea");

const obtenerTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find({ creadoPor: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(tareas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tareas", error: error.message });
  }
};

const crearTarea = async (req, res) => {
  try {
    const { texto, prioridad } = req.body;
    if (!texto?.trim()) return res.status(400).json({ message: "El texto es obligatorio" });

    const tarea = new Tarea({
      texto: texto.trim(),
      prioridad: prioridad || "media",
      creadoPor: req.user._id,
    });

    await tarea.save();
    res.status(201).json({ message: "Tarea creada correctamente", tarea });
  } catch (error) {
    res.status(500).json({ message: "Error al crear tarea", error: error.message });
  }
};

const toggleCompletada = async (req, res) => {
  try {
    const tarea = await Tarea.findOne({ _id: req.params.id, creadoPor: req.user._id });
    if (!tarea) return res.status(404).json({ message: "Tarea no encontrada" });

    tarea.completada = !tarea.completada;
    await tarea.save();
    res.status(200).json({ message: "Tarea actualizada", tarea });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar tarea", error: error.message });
  }
};

const eliminarTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findOneAndDelete({ _id: req.params.id, creadoPor: req.user._id });
    if (!tarea) return res.status(404).json({ message: "Tarea no encontrada" });

    res.status(200).json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar tarea", error: error.message });
  }
};

module.exports = { obtenerTareas, crearTarea, toggleCompletada, eliminarTarea };