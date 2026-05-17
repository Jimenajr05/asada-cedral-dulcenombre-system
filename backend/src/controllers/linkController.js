const Link = require("../models/link"); // ← era "../models/link.model" (incorrecto)

const getLinks = async (req, res) => {
  try {
    const links = await Link.find({ estado: true });
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLink = async (req, res) => {
  try {
    const nuevo = new Link(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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