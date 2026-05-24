/**
 * @file sostenibilidadController.js
 * @description Controlador para la gestión de la sostenibilidad ambiental y la red de hidrantes de la ASADA.
 */

const Sostenibilidad = require("../models/sostenibilidad");

/**
 * Obtiene el documento único de Sostenibilidad de la base de datos o lo crea si no existe.
 * @async
 * @function getDocumento
 * @returns {Promise<Object>} El documento de sostenibilidad.
 */
const getDocumento = async () => {
  let doc = await Sostenibilidad.findOne();

  if (!doc) {
    doc = await Sostenibilidad.create({});
  }

  return doc;
};

/**
 * Obtiene la información pública de sostenibilidad.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el documento de sostenibilidad.
 */
exports.getSostenibilidad = async (req, res) => {
  try {
    const data = await getDocumento();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Obtiene la información de sostenibilidad para el panel administrativo.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el documento de sostenibilidad.
 */
exports.getSostenibilidadAdmin = async (req, res) => {
  try {
    const data = await getDocumento();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Actualiza el número total de hidrantes instalados y operativos.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express con el total en req.body.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el documento actualizado.
 */
exports.updateTotalHidrantes = async (req, res) => {
  try {
    const { total } = req.body;

    const doc = await getDocumento();

    if (!doc.galerias || !doc.galerias.hidrantes) {
      return res
        .status(404)
        .json({ message: "Galería de hidrantes no encontrada" });
    }

    doc.galerias.hidrantes.total = total || "";
    await doc.save();

    res.json({
      message: "Total de hidrantes actualizado correctamente",
      data: doc,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Agrega una nueva imagen a una galería específica de sostenibilidad (por ejemplo, 'hidrantes' o 'reforestacion').
 * @async
 * @param {import('express').Request} req - Objeto de petición con parámetro galeria, alt en req.body y req.file.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el documento actualizado.
 */
exports.addImagenGaleria = async (req, res) => {
  try {
    const { galeria } = req.params;
    const { alt } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Debes seleccionar una imagen" });
    }

    const doc = await getDocumento();

    if (!doc.galerias[galeria]) {
      return res.status(404).json({ message: "Galería no encontrada" });
    }

    doc.galerias[galeria].images.push({
      src: `/uploads/sostenibilidad/${req.file.filename}`,
      alt: alt || "",
    });

    await doc.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Actualiza la información (alt) o reemplaza la foto de una imagen existente en una galería de sostenibilidad.
 * @async
 * @param {import('express').Request} req - Objeto de petición con parámetros galeria e index, alt en req.body y opcional req.file.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el documento actualizado.
 */
exports.updateImagenGaleria = async (req, res) => {
  try {
    const { galeria, index } = req.params;
    const { alt } = req.body;

    const doc = await getDocumento();

    if (!doc.galerias[galeria]) {
      return res.status(404).json({ message: "Galería no encontrada" });
    }

    if (!doc.galerias[galeria].images[index]) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    if (req.file) {
      doc.galerias[galeria].images[index].src = `/uploads/sostenibilidad/${req.file.filename}`;
    }

    if (alt !== undefined) {
      doc.galerias[galeria].images[index].alt = alt;
    }

    await doc.save();
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Elimina una imagen específica de una galería por su índice.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express con parámetros galeria e index.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el documento de sostenibilidad actualizado.
 */
exports.deleteImagenGaleria = async (req, res) => {
  try {
    const { galeria, index } = req.params;

    const doc = await getDocumento();

    if (!doc.galerias[galeria]) {
      return res.status(404).json({ message: "Galería no encontrada" });
    }

    if (!doc.galerias[galeria].images[index]) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    doc.galerias[galeria].images.splice(index, 1);

    await doc.save();
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};