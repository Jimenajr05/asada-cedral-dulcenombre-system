/**
 * @file tramiteController.js
 * @description Controlador para gestionar trámites administrativos (solicitudes, requisitos, descargas de formularios).
 */

const Tramite = require("../models/tramite");

/**
 * Crea un nuevo trámite con sus respectivos requisitos y archivo adjunto (formulario).
 * @async
 * @param {import('express').Request} req - Objeto de petición con titulo, requisitos (JSON o Array) en req.body y req.file.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el trámite creado.
 */
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

/**
 * Obtiene todos los trámites activos para la vista pública (ordenados del más reciente al más antiguo).
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el listado de trámites activos.
 */
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

/**
 * Obtiene todos los trámites para la vista administrativa (activos e inactivos).
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el listado de todos los trámites.
 */
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

/**
 * Obtiene la información de un trámite por su ID.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express con parámetro id.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el trámite encontrado.
 */
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

/**
 * Actualiza los campos, requisitos o archivo adjunto de un trámite específico por su ID.
 * @async
 * @param {import('express').Request} req - Objeto de petición con parámetro id, campos en req.body y req.file opcional.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el trámite actualizado.
 */
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

/**
 * Elimina permanentemente un trámite de la base de datos por su ID.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express con parámetro id.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON indicando el éxito de la operación.
 */
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