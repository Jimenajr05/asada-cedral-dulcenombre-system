const Aviso = require("../models/aviso");

const getAvisos = async (req, res) => {
  try {
    const avisos = await Aviso.find({ activo: true }).sort({ fecha: -1 });

    return res.status(200).json(avisos);
  } catch (error) {
    console.error("Error al obtener avisos:", error);
    return res.status(500).json({
      message: "Error al obtener los avisos",
    });
  }
};

const getAvisoById = async (req, res) => {
  try {
    const { id } = req.params;

    const aviso = await Aviso.findById(id);

    if (!aviso || !aviso.activo) {
      return res.status(404).json({
        message: "Aviso no encontrado",
      });
    }

    return res.status(200).json(aviso);
  } catch (error) {
    console.error("Error al obtener aviso:", error);
    return res.status(500).json({
      message: "Error al obtener el aviso",
    });
  }
};

const createAviso = async (req, res) => {
  try {
    const { titulo, descripcion, tipo, fecha, destacado } = req.body;

    if (!titulo || !descripcion || !tipo) {
      return res.status(400).json({
        message: "Título, descripción y tipo son obligatorios",
      });
    }

    const nuevoAviso = new Aviso({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      tipo,
      fecha: fecha || Date.now(),
      destacado: destacado ?? false,
    });

    await nuevoAviso.save();

    return res.status(201).json({
      message: "Aviso creado correctamente",
      aviso: nuevoAviso,
    });
  } catch (error) {
    console.error("Error al crear aviso:", error);
    return res.status(500).json({
      message: "Error al crear el aviso",
    });
  }
};

const updateAviso = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, tipo, fecha, destacado, activo } = req.body;

    const aviso = await Aviso.findById(id);

    if (!aviso) {
      return res.status(404).json({
        message: "Aviso no encontrado",
      });
    }

    if (titulo !== undefined) aviso.titulo = titulo.trim();
    if (descripcion !== undefined) aviso.descripcion = descripcion.trim();
    if (tipo !== undefined) aviso.tipo = tipo;
    if (fecha !== undefined) aviso.fecha = fecha;
    if (destacado !== undefined) aviso.destacado = destacado;
    if (activo !== undefined) aviso.activo = activo;

    await aviso.save();

    return res.status(200).json({
      message: "Aviso actualizado correctamente",
      aviso,
    });
  } catch (error) {
    console.error("Error al actualizar aviso:", error);
    return res.status(500).json({
      message: "Error al actualizar el aviso",
    });
  }
};

const deleteAviso = async (req, res) => {
  try {
    const { id } = req.params;

    const aviso = await Aviso.findById(id);

    if (!aviso) {
      return res.status(404).json({
        message: "Aviso no encontrado",
      });
    }

    aviso.activo = false;
    await aviso.save();

    return res.status(200).json({
      message: "Aviso eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar aviso:", error);
    return res.status(500).json({
      message: "Error al eliminar el aviso",
    });
  }
};

module.exports = {
  getAvisos,
  getAvisoById,
  createAviso,
  updateAviso,
  deleteAviso,
};