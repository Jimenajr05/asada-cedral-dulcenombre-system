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

    res.status(201).json(nuevaFoto);
  } catch (error) {
    res.status(500).json({
      message: "Error al subir foto",
      error: error.message,
    });
  }
};

// OBTENER
const getFotos = async (req, res) => {
  try {
    const fotos = await Foto.find().sort({ createdAt: -1 });
    res.json(fotos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener fotos" });
  }
};

// DESTACAR
const toggleDestacada = async (req, res) => {
  try {
    const foto = await Foto.findById(req.params.id);

    if (!foto) {
      return res.status(404).json({ message: "No encontrada" });
    }

    // quitar destacada de misma sección
    if (!foto.destacada) {
      await Foto.updateMany(
        { seccion: foto.seccion },
        { destacada: false }
      );
    }

    foto.destacada = !foto.destacada;
    await foto.save();

    res.json(foto);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar" });
  }
};

// ELIMINAR
const deleteFoto = async (req, res) => {
  try {
    await Foto.findByIdAndDelete(req.params.id);
    res.json({ message: "Eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar" });
  }
};

module.exports = {
  crearFoto,
  getFotos,
  toggleDestacada,
  deleteFoto,
};