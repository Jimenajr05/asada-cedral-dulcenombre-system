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
    const actualizado = await Link.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLinks, createLink, updateLink };