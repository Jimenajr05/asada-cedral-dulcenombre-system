/**
 * @file transparenciaController.js
 * @description Controlador para gestionar la sección de transparencia institucional (reuniones de junta/asamblea, certificados, galardones y estados financieros).
 */

const Transparencia = require("../models/transparencia");

/**
 * Obtiene el documento único de transparencia o lo crea si no existe.
 * @async
 * @function getDocumento
 * @returns {Promise<Object>} El documento de transparencia.
 */
const getDocumento = async () => {
  let doc = await Transparencia.findOne();
  if (!doc) doc = await Transparencia.create({ reuniones: [], certificados: [] });
  return doc;
};

/**
 * Obtiene la información completa de la sección de transparencia.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el documento de transparencia.
 */
const getTransparencia = async (req, res) => {
  try {
    const doc = await getDocumento();
    return res.status(200).json(doc);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener transparencia", error: error.message });
  }
};

/**
 * Agrega una nueva sesión o reunión de junta directiva / asamblea general.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express con descripcion, fecha y tipo.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el documento actualizado.
 */
const addReunion = async (req, res) => {
  try {
    const { descripcion, fecha, tipo } = req.body;

    if (!descripcion || !fecha) {
      return res.status(400).json({ message: "Descripción y fecha son obligatorias" });
    }

    const doc = await getDocumento();
    doc.reuniones.push({ descripcion, fecha, tipo: tipo || "ordinaria" });
    await doc.save();

    return res.status(201).json({ message: "Reunión agregada correctamente", transparencia: doc });
  } catch (error) {
    return res.status(500).json({ message: "Error al agregar reunión", error: error.message });
  }
};

/**
 * Actualiza los datos de una reunión específica por su ID.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express con parámetro id y campos opcionales en req.body.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el documento actualizado.
 */
const updateReunion = async (req, res) => {
  try {
    const doc = await getDocumento();
    const reunion = doc.reuniones.id(req.params.id);

    if (!reunion) return res.status(404).json({ message: "Reunión no encontrada" });

    reunion.descripcion = req.body.descripcion ?? reunion.descripcion;
    reunion.fecha = req.body.fecha ?? reunion.fecha;
    reunion.tipo = req.body.tipo ?? reunion.tipo;

    await doc.save();
    return res.status(200).json({ message: "Reunión actualizada correctamente", transparencia: doc });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar reunión", error: error.message });
  }
};

/**
 * Elimina una reunión específica de la lista por su ID.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express con parámetro id.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el documento actualizado.
 */
const deleteReunion = async (req, res) => {
  try {
    const doc = await getDocumento();
    const reunion = doc.reuniones.id(req.params.id);

    if (!reunion) return res.status(404).json({ message: "Reunión no encontrada" });

    reunion.deleteOne();
    await doc.save();

    return res.status(200).json({ message: "Reunión eliminada correctamente", transparencia: doc });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar reunión", error: error.message });
  }
};

/**
 * Agrega un nuevo certificado de calidad, galardón o atestado con su imagen correspondiente.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express con titulo en req.body y req.file.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el documento actualizado.
 */
const addCertificado = async (req, res) => {
  try {
    const { titulo } = req.body;

    if (!titulo) return res.status(400).json({ message: "El título es obligatorio" });
    if (!req.file) return res.status(400).json({ message: "La imagen es obligatoria" });

    const doc = await getDocumento();
    doc.certificados.push({
      titulo,
      imagenUrl: `/uploads/certificados/${req.file.filename}`,
    });
    await doc.save();

    return res.status(201).json({ message: "Certificado agregado correctamente", transparencia: doc });
  } catch (error) {
    return res.status(500).json({ message: "Error al agregar certificado", error: error.message });
  }
};

/**
 * Elimina un certificado existente por su ID.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express con parámetro id.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el documento actualizado.
 */
const deleteCertificado = async (req, res) => {
  try {
    const doc = await getDocumento();
    const cert = doc.certificados.id(req.params.id);

    if (!cert) return res.status(404).json({ message: "Certificado no encontrado" });

    cert.deleteOne();
    await doc.save();

    return res.status(200).json({ message: "Certificado eliminado correctamente", transparencia: doc });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar certificado", error: error.message });
  }
};

/**
 * Actualiza el título o reemplaza la foto de un certificado existente por su ID.
 * @async
 * @param {import('express').Request} req - Objeto de petición con parámetro id, titulo en req.body y req.file opcional.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el documento de transparencia actualizado.
 */
const updateCertificado = async (req, res) => {
  try {
    const { titulo } = req.body;
    const doc = await getDocumento();
    const cert = doc.certificados.id(req.params.id);

    if (!cert) return res.status(404).json({ message: "Certificado no encontrado" });

    cert.titulo = titulo ?? cert.titulo;

    if (req.file) {
      cert.imagenUrl = `/uploads/certificados/${req.file.filename}`;
    }

    await doc.save();
    return res.status(200).json({ message: "Certificado actualizado correctamente", transparencia: doc });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar certificado", error: error.message });
  }
};

module.exports = {
  getTransparencia,
  addReunion,
  updateReunion,
  deleteReunion,
  addCertificado,
  updateCertificado,
  deleteCertificado,
};