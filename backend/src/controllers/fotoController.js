const Foto = require("../models/foto");

// SUBIR FOTO
const crearFoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Imagen requerida" });
    }

    const nuevaFoto = new Foto({
      titulo: req.body.titulo,
      seccion: req.body.seccion,
      url: `/uploads/fotos/${req.file.filename}`,
    });

    await nuevaFoto.save();

    return res.status(201).json({
      message: "Foto subida correctamente",
      foto: nuevaFoto,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al subir foto",
      error: error.message,
    });
  }
};

// OBTENER TODAS
const getFotos = async (req, res) => {
  try {
    const fotos = await Foto.find().sort({ createdAt: -1 });
    return res.status(200).json(fotos);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener fotos",
      error: error.message,
    });
  }
};

// OBTENER POR ID
const getFotoById = async (req, res) => {
  try {
    const foto = await Foto.findById(req.params.id);

    if (!foto) {
      return res.status(404).json({
        message: "Foto no encontrada",
      });
    }

    return res.status(200).json(foto);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener foto",
      error: error.message,
    });
  }
};

// ACTUALIZAR FOTO
const updateFoto = async (req, res) => {
  try {
    const foto = await Foto.findById(req.params.id);

    if (!foto) {
      return res.status(404).json({
        message: "Foto no encontrada",
      });
    }

    foto.titulo = req.body.titulo ?? foto.titulo;
    foto.seccion = req.body.seccion ?? foto.seccion;

    if (req.file) {
      foto.url = `/uploads/fotos/${req.file.filename}`;
    }

    await foto.save();

    return res.status(200).json({
      message: "Foto actualizada correctamente",
      foto,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar foto",
      error: error.message,
    });
  }
};

// DESTACAR
const toggleDestacada = async (req, res) => {
  try {
    const foto = await Foto.findById(req.params.id);

    if (!foto) {
      return res.status(404).json({ message: "Foto no encontrada" });
    }

    if (!foto.destacada) {
      await Foto.updateMany({ seccion: foto.seccion }, { destacada: false });
    }

    foto.destacada = !foto.destacada;
    await foto.save();

    return res.status(200).json({
      message: "Estado destacada actualizado correctamente",
      foto,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar foto",
      error: error.message,
    });
  }
};

// ELIMINAR
const deleteFoto = async (req, res) => {
  try {
    const foto = await Foto.findById(req.params.id);

    if (!foto) {
      return res.status(404).json({
        message: "Foto no encontrada",
      });
    }

    await Foto.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Foto eliminada correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar foto",
      error: error.message,
    });
  }
};

module.exports = {
  crearFoto,
  getFotos,
  getFotoById,
  updateFoto,
  toggleDestacada,
  deleteFoto,
};