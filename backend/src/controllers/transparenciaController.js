const Transparencia = require("../models/transparencia");

// Obtiene (o crea) el documento único de transparencia
const getDocumento = async () => {
  let doc = await Transparencia.findOne();
  if (!doc) doc = await Transparencia.create({ reuniones: [], certificados: [] });
  return doc;
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/transparencia  — público
// ─────────────────────────────────────────────────────────────────────────────
const getTransparencia = async (req, res) => {
  try {
    const doc = await getDocumento();
    return res.status(200).json(doc);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener transparencia", error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// REUNIONES
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/transparencia/reuniones
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

// PUT /api/transparencia/reuniones/:id
const updateReunion = async (req, res) => {
  try {
    const doc = await getDocumento();
    const reunion = doc.reuniones.id(req.params.id);

    if (!reunion) return res.status(404).json({ message: "Reunión no encontrada" });

    reunion.descripcion = req.body.descripcion ?? reunion.descripcion;
    reunion.fecha       = req.body.fecha       ?? reunion.fecha;
    reunion.tipo        = req.body.tipo        ?? reunion.tipo;

    await doc.save();
    return res.status(200).json({ message: "Reunión actualizada correctamente", transparencia: doc });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar reunión", error: error.message });
  }
};

// DELETE /api/transparencia/reuniones/:id
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

// ─────────────────────────────────────────────────────────────────────────────
// CERTIFICADOS
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/transparencia/certificados  — requiere archivo (multer)
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

// DELETE /api/transparencia/certificados/:id
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

module.exports = {
  getTransparencia,
  addReunion,
  updateReunion,
  deleteReunion,
  addCertificado,
  deleteCertificado,
};