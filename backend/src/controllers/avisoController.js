const Aviso = require("../models/aviso");

// Crear aviso
const crearAviso = async (req, res) => {
  try {
    const { titulo, descripcion, tipo, estado, fijado } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    if (!titulo || !descripcion) {
      return res.status(400).json({
        message: "El título y la descripción son obligatorios",
      });
    }

    const nuevoAviso = new Aviso({
      titulo,
      descripcion,
      tipo: tipo || "info",
      estado: estado || "borrador",
      fijado: fijado ?? false,
      creadoPor: req.user._id,
    });

    await nuevoAviso.save();

    return res.status(201).json({
      message: "Aviso creado correctamente",
      aviso: nuevoAviso,
    });
  } catch (error) {
    console.error("ERROR AL CREAR AVISO:", error);
    return res.status(500).json({
      message: "Error al crear el aviso",
      error: error.message,
    });
  }
};

// Obtener todos los avisos
const obtenerAvisos = async (req, res) => {
  try {
    const avisos = await Aviso.find().sort({ fijado: -1, createdAt: -1 });

    return res.status(200).json(avisos);
  } catch (error) {
    console.error("ERROR AL OBTENER AVISOS:", error);
    return res.status(500).json({
      message: "Error al obtener los avisos",
      error: error.message,
    });
  }
};

// Obtener un aviso por id
const obtenerAvisoPorId = async (req, res) => {
  try {
    const aviso = await Aviso.findById(req.params.id);

    if (!aviso) {
      return res.status(404).json({
        message: "Aviso no encontrado",
      });
    }

    return res.status(200).json(aviso);
  } catch (error) {
    console.error("ERROR AL OBTENER AVISO:", error);
    return res.status(500).json({
      message: "Error al obtener el aviso",
      error: error.message,
    });
  }
};

// Editar aviso
const actualizarAviso = async (req, res) => {
  try {
    const { titulo, descripcion, tipo, estado, fijado } = req.body;

    const aviso = await Aviso.findById(req.params.id);

    if (!aviso) {
      return res.status(404).json({
        message: "Aviso no encontrado",
      });
    }

    aviso.titulo = titulo ?? aviso.titulo;
    aviso.descripcion = descripcion ?? aviso.descripcion;
    aviso.tipo = tipo ?? aviso.tipo;
    aviso.estado = estado ?? aviso.estado;
    aviso.fijado = fijado ?? aviso.fijado;

    await aviso.save();

    return res.status(200).json({
      message: "Aviso actualizado correctamente",
      aviso,
    });
  } catch (error) {
    console.error("ERROR AL ACTUALIZAR AVISO:", error);
    return res.status(500).json({
      message: "Error al actualizar el aviso",
      error: error.message,
    });
  }
};

// Eliminar aviso
const eliminarAviso = async (req, res) => {
  try {
    const aviso = await Aviso.findById(req.params.id);

    if (!aviso) {
      return res.status(404).json({
        message: "Aviso no encontrado",
      });
    }

    await Aviso.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Aviso eliminado correctamente",
    });
  } catch (error) {
    console.error("ERROR AL ELIMINAR AVISO:", error);
    return res.status(500).json({
      message: "Error al eliminar el aviso",
      error: error.message,
    });
  }
};

module.exports = {
  crearAviso,
  obtenerAvisos,
  obtenerAvisoPorId,
  actualizarAviso,
  eliminarAviso,
};