const fs      = require("fs");
const path    = require("path");
const Proyecto = require("../models/proyecto");

// ── PROYECTOS ──────────────────────────────────────────────────

const obtenerProyectosPublico = async (req, res) => {
  try {
    const proyectos = await Proyecto.find().sort({ createdAt: -1 });
    res.status(200).json(proyectos);
  } catch (error) {
    console.error("ERROR PROYECTOS:", error);
    res.status(500).json({ message: "Error al obtener proyectos", error: error.message });
  }
};

const obtenerProyectosAdmin = async (req, res) => {
  try {
    const proyectos = await Proyecto.find().sort({ createdAt: -1 });
    res.status(200).json(proyectos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener proyectos", error: error.message });
  }
};

const crearProyecto = async (req, res) => {
  try {
    const { titulo, descripcion, estado } = req.body;

    if (!titulo) return res.status(400).json({ message: "El título es obligatorio" });

    const proyecto = new Proyecto({
      titulo,
      descripcion: descripcion || "",
      estado:      estado || "En progreso",
      creadoPor:   req.user._id,
    });

    await proyecto.save();
    res.status(201).json({ message: "Proyecto creado correctamente", proyecto });
  } catch (error) {
    console.error("ERROR AL CREAR PROYECTO:", error); // ← agregá esto
    res.status(500).json({ message: "Error al crear proyecto", error: error.message });
  }
};

const actualizarProyecto = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) return res.status(404).json({ message: "Proyecto no encontrado" });

    const { titulo, descripcion, estado } = req.body;
    if (titulo)      proyecto.titulo      = titulo;
    if (descripcion !== undefined) proyecto.descripcion = descripcion;
    if (estado)      proyecto.estado      = estado;

    await proyecto.save();
    res.status(200).json({ message: "Proyecto actualizado correctamente", proyecto });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar proyecto", error: error.message });
  }
};

const eliminarProyecto = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) return res.status(404).json({ message: "Proyecto no encontrado" });

    // Eliminar archivos físicos de fotos
    for (const foto of proyecto.fotos) {
      const ruta = path.join(__dirname, "../../", foto.src.replace(/^\/+/, ""));
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    }

    // Eliminar archivos físicos de documentos
    for (const doc of proyecto.documentos) {
      const ruta = path.join(__dirname, "../../", doc.url.replace(/^\/+/, ""));
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    }

    await Proyecto.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Proyecto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar proyecto", error: error.message });
  }
};

// ── FOTOS ──────────────────────────────────────────────────────

const agregarFoto = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) return res.status(404).json({ message: "Proyecto no encontrado" });

    if (!req.file) return res.status(400).json({ message: "Debe seleccionar una imagen" });

    proyecto.fotos.push({
      src: `/uploads/proyectos/fotos/${req.file.filename}`,
      alt: req.body.alt || "",
    });

    await proyecto.save();
    res.status(201).json({ message: "Foto agregada correctamente", proyecto });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar foto", error: error.message });
  }
};

const eliminarFoto = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) return res.status(404).json({ message: "Proyecto no encontrado" });

    const foto = proyecto.fotos.id(req.params.fotoId);
    if (!foto) return res.status(404).json({ message: "Foto no encontrada" });

    const ruta = path.join(__dirname, "../../", foto.src.replace(/^\/+/, ""));
    if (fs.existsSync(ruta)) fs.unlinkSync(ruta);

    proyecto.fotos.pull(req.params.fotoId);
    await proyecto.save();
    res.status(200).json({ message: "Foto eliminada correctamente", proyecto });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar foto", error: error.message });
  }
};

// ── DOCUMENTOS ─────────────────────────────────────────────────

const agregarDocumento = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) return res.status(404).json({ message: "Proyecto no encontrado" });

    if (!req.file) return res.status(400).json({ message: "Debe seleccionar un documento" });

    proyecto.documentos.push({
      nombre: req.body.nombre || req.file.originalname,
      url:    `/uploads/proyectos/documentos/${req.file.filename}`,
    });

    await proyecto.save();
    res.status(201).json({ message: "Documento agregado correctamente", proyecto });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar documento", error: error.message });
  }
};

const eliminarDocumento = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) return res.status(404).json({ message: "Proyecto no encontrado" });

    const doc = proyecto.documentos.id(req.params.docId);
    if (!doc) return res.status(404).json({ message: "Documento no encontrado" });

    const ruta = path.join(__dirname, "../../", doc.url.replace(/^\/+/, ""));
    if (fs.existsSync(ruta)) fs.unlinkSync(ruta);

    proyecto.documentos.pull(req.params.docId);
    await proyecto.save();
    res.status(200).json({ message: "Documento eliminado correctamente", proyecto });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar documento", error: error.message });
  }
};

// ── ACTUALIZACIONES ────────────────────────────────────────────

const agregarActualizacion = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) return res.status(404).json({ message: "Proyecto no encontrado" });

    const { texto } = req.body;
    if (!texto) return res.status(400).json({ message: "El texto es obligatorio" });

    proyecto.actualizaciones.push({ texto, fecha: new Date() });
    await proyecto.save();
    res.status(201).json({ message: "Actualización agregada correctamente", proyecto });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar actualización", error: error.message });
  }
};

const editarActualizacion = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) return res.status(404).json({ message: "Proyecto no encontrado" });

    const actualizacion = proyecto.actualizaciones.id(req.params.actId);
    if (!actualizacion) return res.status(404).json({ message: "Actualización no encontrada" });

    const { texto } = req.body;
    if (!texto) return res.status(400).json({ message: "El texto es obligatorio" });

    actualizacion.texto = texto;
    await proyecto.save();
    res.status(200).json({ message: "Actualización editada correctamente", proyecto });
  } catch (error) {
    res.status(500).json({ message: "Error al editar actualización", error: error.message });
  }
};

const eliminarActualizacion = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) return res.status(404).json({ message: "Proyecto no encontrado" });

    const actualizacion = proyecto.actualizaciones.id(req.params.actId);
    if (!actualizacion) return res.status(404).json({ message: "Actualización no encontrada" });

    proyecto.actualizaciones.pull(req.params.actId);
    await proyecto.save();
    res.status(200).json({ message: "Actualización eliminada correctamente", proyecto });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar actualización", error: error.message });
  }
};

module.exports = {
  obtenerProyectosPublico,
  obtenerProyectosAdmin,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto,
  agregarFoto,
  eliminarFoto,
  agregarDocumento,
  eliminarDocumento,
  agregarActualizacion,
  editarActualizacion,
  eliminarActualizacion,
};