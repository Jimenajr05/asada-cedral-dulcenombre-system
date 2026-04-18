const Tramite = require("../models/tramite");

// CREAR
const crearTramite = async (req, res) => {
  try {
    const { titulo, requisitos, buttonText } = req.body;

    if (!titulo) {
      return res.status(400).json({
        message: "El título es obligatorio",
      });
    }

    let requisitosParseados = [];

    if (requisitos) {
      try {
        const requisitosArray =
          typeof requisitos === "string" ? JSON.parse(requisitos) : requisitos;

        requisitosParseados = Array.isArray(requisitosArray)
          ? requisitosArray
              .filter((item) => item && item.trim() !== "")
              .map((item) => ({ texto: item.trim() }))
          : [];
      } catch (error) {
        return res.status(400).json({
          message: "Los requisitos no tienen un formato válido",
        });
      }
    }

    const nuevoTramite = new Tramite({
      titulo: titulo.trim(),
      requisitos: requisitosParseados,
      buttonText: buttonText || "Descargar Formulario",
      archivoUrl: req.file ? `/uploads/tramites/${req.file.filename}` : "",
    });

    await nuevoTramite.save();

    return res.status(201).json({
      message: "Trámite creado correctamente",
      tramite: nuevoTramite,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear trámite",
      error: error.message,
    });
  }
};

// OBTENER TODOS
const getTramites = async (req, res) => {
  try {
    const tramites = await Tramite.find({ activo: true }).sort({ createdAt: -1 });

    return res.status(200).json(tramites);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener trámites",
      error: error.message,
    });
  }
};

// OBTENER TODOS ADMIN
const getTramitesAdmin = async (req, res) => {
  try {
    const tramites = await Tramite.find().sort({ createdAt: -1 });

    return res.status(200).json(tramites);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener trámites",
      error: error.message,
    });
  }
};

// OBTENER POR ID
const getTramiteById = async (req, res) => {
  try {
    const tramite = await Tramite.findById(req.params.id);

    if (!tramite) {
      return res.status(404).json({
        message: "Trámite no encontrado",
      });
    }

    return res.status(200).json(tramite);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener trámite",
      error: error.message,
    });
  }
};

// ACTUALIZAR
const updateTramite = async (req, res) => {
  try {
    const tramite = await Tramite.findById(req.params.id);

    if (!tramite) {
      return res.status(404).json({
        message: "Trámite no encontrado",
      });
    }

    tramite.titulo = req.body.titulo ?? tramite.titulo;
    tramite.buttonText = req.body.buttonText ?? tramite.buttonText;

    if (req.body.requisitos !== undefined) {
      try {
        const requisitosArray =
          typeof req.body.requisitos === "string"
            ? JSON.parse(req.body.requisitos)
            : req.body.requisitos;

        tramite.requisitos = Array.isArray(requisitosArray)
          ? requisitosArray
              .filter((item) => item && item.trim() !== "")
              .map((item) => ({ texto: item.trim() }))
          : [];
      } catch (error) {
        return res.status(400).json({
          message: "Los requisitos no tienen un formato válido",
        });
      }
    }

    if (req.file) {
      tramite.archivoUrl = `/uploads/tramites/${req.file.filename}`;
    }

    await tramite.save();

    return res.status(200).json({
      message: "Trámite actualizado correctamente",
      tramite,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar trámite",
      error: error.message,
    });
  }
};

// ELIMINAR
const deleteTramite = async (req, res) => {
  try {
    const tramite = await Tramite.findById(req.params.id);

    if (!tramite) {
      return res.status(404).json({
        message: "Trámite no encontrado",
      });
    }

    await Tramite.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Trámite eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar trámite",
      error: error.message,
    });
  }
};

module.exports = {
  crearTramite,
  getTramites,
  getTramitesAdmin,
  getTramiteById,
  updateTramite,
  deleteTramite,
};