const Sostenibilidad = require("../models/sostenibilidad");

const getDocumento = async () => {
  let doc = await Sostenibilidad.findOne();

  if (!doc) {
    doc = await Sostenibilidad.create({});
  }

  return doc;
};

exports.getSostenibilidad = async (req, res) => {
  try {
    const data = await getDocumento();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSostenibilidadAdmin = async (req, res) => {
  try {
    const data = await getDocumento();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
      alt: alt || "Imagen de galería",
    });

    await doc.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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