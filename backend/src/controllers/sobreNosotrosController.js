const SobreNosotros = require("../models/sobreNosotros");

const getDocumento = async () => {
  let documento = await SobreNosotros.findOne();

  if (!documento) {
    documento = await SobreNosotros.create({
      periodo: "",
      miembros: [],
      cobertura: [],
    });
  }

  return documento;
};

// OBTENER TODO
const getSobreNosotros = async (req, res) => {
  try {
    const documento = await getDocumento();
    return res.status(200).json(documento);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener Sobre Nosotros",
      error: error.message,
    });
  }
};

// ACTUALIZAR PERIODO
const updateSobreNosotros = async (req, res) => {
  try {
    const documento = await getDocumento();

    documento.periodo = req.body.periodo ?? documento.periodo;

    await documento.save();

    return res.status(200).json({
      message: "Período actualizado correctamente",
      sobreNosotros: documento,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar Sobre Nosotros",
      error: error.message,
    });
  }
};

// AGREGAR MIEMBRO
const addMiembro = async (req, res) => {
  try {
    const { nombre, cargo } = req.body;

    if (!nombre || !cargo) {
      return res.status(400).json({
        message: "Nombre y cargo son obligatorios",
      });
    }

    const documento = await getDocumento();

    documento.miembros.push({
      nombre,
      cargo,
      foto: req.file ? `/uploads/fotos/${req.file.filename}` : "",
    });

    await documento.save();

    return res.status(201).json({
      message: "Miembro agregado correctamente",
      sobreNosotros: documento,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al agregar miembro",
      error: error.message,
    });
  }
};

// ACTUALIZAR MIEMBRO
const updateMiembro = async (req, res) => {
  try {
    const { index } = req.params;
    const documento = await getDocumento();

    if (!documento.miembros[index]) {
      return res.status(404).json({
        message: "Miembro no encontrado",
      });
    }

    documento.miembros[index].nombre =
      req.body.nombre ?? documento.miembros[index].nombre;

    documento.miembros[index].cargo =
      req.body.cargo ?? documento.miembros[index].cargo;

    if (req.file) {
      documento.miembros[index].foto = `/uploads/fotos/${req.file.filename}`;
    }

    await documento.save();

    return res.status(200).json({
      message: "Miembro actualizado correctamente",
      sobreNosotros: documento,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar miembro",
      error: error.message,
    });
  }
};

// ELIMINAR MIEMBRO
const deleteMiembro = async (req, res) => {
  try {
    const { index } = req.params;
    const documento = await getDocumento();

    if (!documento.miembros[index]) {
      return res.status(404).json({
        message: "Miembro no encontrado",
      });
    }

    documento.miembros.splice(index, 1);
    await documento.save();

    return res.status(200).json({
      message: "Miembro eliminado correctamente",
      sobreNosotros: documento,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar miembro",
      error: error.message,
    });
  }
};

// AGREGAR COBERTURA
const addCobertura = async (req, res) => {
  try {
    const { valor, descripcion } = req.body;

    if (!valor || !descripcion) {
      return res.status(400).json({
        message: "Valor y descripción son obligatorios",
      });
    }

    const documento = await getDocumento();

    documento.cobertura.push({
      valor,
      descripcion,
    });

    await documento.save();

    return res.status(201).json({
      message: "Dato de cobertura agregado correctamente",
      sobreNosotros: documento,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al agregar cobertura",
      error: error.message,
    });
  }
};

// ACTUALIZAR COBERTURA
const updateCobertura = async (req, res) => {
  try {
    const { index } = req.params;
    const documento = await getDocumento();

    if (!documento.cobertura[index]) {
      return res.status(404).json({
        message: "Dato de cobertura no encontrado",
      });
    }

    documento.cobertura[index].valor =
      req.body.valor ?? documento.cobertura[index].valor;

    documento.cobertura[index].descripcion =
      req.body.descripcion ?? documento.cobertura[index].descripcion;

    await documento.save();

    return res.status(200).json({
      message: "Cobertura actualizada correctamente",
      sobreNosotros: documento,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar cobertura",
      error: error.message,
    });
  }
};

// ELIMINAR COBERTURA
const deleteCobertura = async (req, res) => {
  try {
    const { index } = req.params;
    const documento = await getDocumento();

    if (!documento.cobertura[index]) {
      return res.status(404).json({
        message: "Dato de cobertura no encontrado",
      });
    }

    documento.cobertura.splice(index, 1);
    await documento.save();

    return res.status(200).json({
      message: "Cobertura eliminada correctamente",
      sobreNosotros: documento,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar cobertura",
      error: error.message,
    });
  }
};

module.exports = {
  getSobreNosotros,
  updateSobreNosotros,
  addMiembro,
  updateMiembro,
  deleteMiembro,
  addCobertura,
  updateCobertura,
  deleteCobertura,
};