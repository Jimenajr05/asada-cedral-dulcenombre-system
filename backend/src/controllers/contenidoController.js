const Contenido = require("../models/contenido");

const SECCIONES_PERMITIDAS = {
  home: ["home-hero", "home-bienvenida"],
  about: ["junta-directiva"],
  "gestion-agua": ["gestion-agua-hero", "gestion-agua-info"],
  sostenibilidad: ["sostenibilidad-hero", "sostenibilidad-info"],
  tramites: ["tramites-hero", "tramites-info"],
  avisos: ["avisos-hero", "avisos-info"],
  contacto: ["contacto-hero", "contact-info"],
};

const SLUGS_BLOQUEADOS_EN_ABOUT = [
  "about-hero",
  "historia",
  "mision",
  "vision",
  "valores",
];

const esSeccionPermitida = (pagina, slug) => {
  if (!pagina || !slug) return false;

  const secciones = SECCIONES_PERMITIDAS[pagina];
  if (!secciones) return false;

  return secciones.includes(slug);
};

const validarPaginaYSlug = (pagina, slug) => {
  if (!pagina || !slug) {
    return {
      valido: false,
      message: "La página y el slug son obligatorios",
    };
  }

  if (pagina === "about" && slug !== "junta-directiva") {
    return {
      valido: false,
      message:
        "En la página Sobre Nosotros solo se permite la sección junta-directiva",
    };
  }

  if (pagina === "about" && SLUGS_BLOQUEADOS_EN_ABOUT.includes(slug)) {
    return {
      valido: false,
      message:
        "Esta sección de Sobre Nosotros está fija en el frontend y no puede editarse desde el backend",
    };
  }

  if (!esSeccionPermitida(pagina, slug)) {
    return {
      valido: false,
      message: "La sección no está permitida para la página seleccionada",
    };
  }

  return { valido: true };
};

const getContenidos = async (req, res) => {
  try {
    const { pagina } = req.query;

    let filtro = {};

    if (pagina) {
      filtro.pagina = pagina;
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

    const validacion = validarPaginaYSlug(pagina, slug);

    if (!validacion.valido) {
      return res.status(400).json({
        message: validacion.message,
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

    const paginaFinal = pagina ?? contenidoExistente.pagina;
    const slugFinal = slug ?? contenidoExistente.slug;

    const validacion = validarPaginaYSlug(paginaFinal, slugFinal);

    if (!validacion.valido) {
      return res.status(400).json({
        message: validacion.message,
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
    contenidoExistente.slug = slugFinal;
    contenidoExistente.contenido = contenido ?? contenidoExistente.contenido;
    contenidoExistente.activo = activo ?? contenidoExistente.activo;
    contenidoExistente.pagina = paginaFinal;

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

    if (contenido.pagina === "about" && contenido.slug !== "junta-directiva") {
      return res.status(403).json({
        message:
          "En Sobre Nosotros solo se puede cambiar el estado de junta-directiva",
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

    if (contenido.pagina === "about" && contenido.slug !== "junta-directiva") {
      return res.status(403).json({
        message:
          "En Sobre Nosotros solo se puede eliminar la sección junta-directiva",
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