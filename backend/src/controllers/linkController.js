/**
 * @file linkController.js
 * @description Controlador para administrar enlaces de interés institucional y accesos directos.
 */

const Link = require("../models/link");

/**
 * Obtiene todos los enlaces activos.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el listado de enlaces activos.
 */
const getLinks = async (req, res) => {
  try {
    const links = await Link.find({ estado: true });
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Crea un nuevo enlace de interés.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express con url y label.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el enlace creado.
 */
const createLink = async (req, res) => {
  try {
    const nuevo = new Link(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Actualiza la información de un enlace existente por su ID.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express con el parámetro id y cuerpo.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el enlace actualizado.
 */
const updateLink = async (req, res) => {
  try {
    const { url, label } = req.body;
    if (!url || !url.trim()) {
      return res.status(400).json({ message: "La URL es obligatoria" });
    }
    const updateData = { url: url.trim() };
    if (label && label.trim()) {
      updateData.label = label.trim();
    }
    const actualizado = await Link.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" }
    );
    if (!actualizado) {
      return res.status(404).json({ message: "Link no encontrado" });
    }
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Elimina un enlace por su ID.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express con parámetro id.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON indicando el éxito del borrado.
 */
const deleteLink = async (req, res) => {
  try {
    const eliminado = await Link.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ message: "Link no encontrado" });
    }
    res.json({ message: "Link eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLinks, createLink, updateLink, deleteLink };