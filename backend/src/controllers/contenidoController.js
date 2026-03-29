const Contenido = require("../models/contenido");

const getContenidos = async (req, res) => {
  try {
    const { pagina } = req.query;

    let filtro = {};

    if (pagina) {
      const paginasRelacionadas = [pagina];

      if (pagina === "about") {
        paginasRelacionadas.push("sobre-nosotros");
      }

      if (pagina === "sobre-nosotros") {
        paginasRelacionadas.push("about");
      }

      filtro.pagina = { $in: paginasRelacionadas };
    }

    const contenidos = await Contenido.find(filtro).sort({ createdAt: 1 });

    return res.status(200).json(contenidos);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener contenidos",
      error: error.message,
    });
  }
};

const getContenidoById = async (req, res) => {
  try {
    const contenido = await Contenido.findById(req.params.id);

    if (!contenido) {
      return res.status(404).json({
        message: "Contenido no encontrado",
      });
    }

    return res.status(200).json(contenido);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener contenido",
      error: error.message,
    });
  }
};

const createContenido = async (req, res) => {
  try {
    const { titulo, slug, contenido, activo, pagina } = req.body;

    if (!titulo || !slug || !pagina) {
      return res.status(400).json({
        message: "El título, slug y página son obligatorios",
      });
    }

    const existe = await Contenido.findOne({ slug });

    if (existe) {
      return res.status(400).json({
        message: "Ya existe una sección con ese slug",
      });
    }

    const nuevoContenido = new Contenido({
      titulo,
      slug,
      contenido: contenido || "",
      activo: activo ?? true,
      pagina,
    });

    await nuevoContenido.save();

    return res.status(201).json({
      message: "Sección creada correctamente",
      contenido: nuevoContenido,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear contenido",
      error: error.message,
    });
  }
};

const updateContenido = async (req, res) => {
  try {
    const { titulo, slug, contenido, activo, pagina } = req.body;

    const contenidoExistente = await Contenido.findById(req.params.id);

    if (!contenidoExistente) {
      return res.status(404).json({
        message: "Contenido no encontrado",
      });
    }

    if (slug && slug !== contenidoExistente.slug) {
      const slugDuplicado = await Contenido.findOne({ slug });

      if (slugDuplicado) {
        return res.status(400).json({
          message: "Ya existe una sección con ese slug",
        });
      }
    }

    contenidoExistente.titulo = titulo ?? contenidoExistente.titulo;
    contenidoExistente.slug = slug ?? contenidoExistente.slug;
    contenidoExistente.contenido = contenido ?? contenidoExistente.contenido;
    contenidoExistente.activo = activo ?? contenidoExistente.activo;
    contenidoExistente.pagina = pagina ?? contenidoExistente.pagina;

    await contenidoExistente.save();

    return res.status(200).json({
      message: "Contenido actualizado correctamente",
      contenido: contenidoExistente,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar contenido",
      error: error.message,
    });
  }
};

const toggleContenidoActivo = async (req, res) => {
  try {
    const contenido = await Contenido.findById(req.params.id);

    if (!contenido) {
      return res.status(404).json({
        message: "Contenido no encontrado",
      });
    }

    contenido.activo = !contenido.activo;
    await contenido.save();

    return res.status(200).json({
      message: "Estado actualizado correctamente",
      contenido,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al cambiar estado del contenido",
      error: error.message,
    });
  }
};

const eliminarContenido = async (req, res) => {
  try {
    const contenido = await Contenido.findById(req.params.id);

    if (!contenido) {
      return res.status(404).json({
        message: "Contenido no encontrado",
      });
    }

    await Contenido.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Contenido eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar contenido",
      error: error.message,
    });
  }
};

module.exports = {
  getContenidos,
  getContenidoById,
  createContenido,
  updateContenido,
  toggleContenidoActivo,
  eliminarContenido,
};