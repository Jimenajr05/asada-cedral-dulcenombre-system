/**
 * @file gestionAguaController.js
 * @description Controlador para administrar la información técnica y de calidad de la gestión del agua.
 */

const fs = require("fs");
const path = require("path");
const GestionAgua = require("../models/gestionAgua");

/**
 * Crea el documento inicial de gestión del agua con datos semilla si no existe.
 * @async
 * @function crearDocumentoInicial
 * @returns {Promise<Object>} El documento de gestión del agua de MongoDB.
 */
const crearDocumentoInicial = async () => {
  let documento = await GestionAgua.findOne();

  if (!documento) {
    documento = await GestionAgua.create({
      hero: {
        title: "Gestión del Agua",
        subtitle:
          "Procesos, control de calidad e infraestructura del sistema de acueducto de la ASADA Cedral y Dulce Nombre.",
      },

      proceso: [
        {
          titulo: "Captación",
          descripcion:
            "Obtención del agua desde nacientes protegidas y concesionadas.",
        },
        {
          titulo: "Tratamiento",
          descripcion:
            "Procesos de desinfección y control para garantizar agua potable.",
        },
        {
          titulo: "Almacenamiento",
          descripcion:
            "Tanques que permiten mantener la continuidad del servicio.",
        },
        {
          titulo: "Distribución",
          descripcion:
            "Sistema de conducción y red que lleva el agua a los abonados.",
        },
      ],

      calidad: [
        {
          titulo: "Análisis Regular",
          descripcion:
            "Realizamos análisis físicos, químicos y bacteriológicos periódicos del agua.",
          icono: "shield",
        },
        {
          titulo: "Monitoreo Diario",
          descripcion:
            "Monitoreo diario de los niveles de cloro y turbidez para garantizar la calidad del agua.",
          icono: "wave",
        },
        {
          titulo: "Laboratorio Certificado",
          descripcion:
            "Trabajamos con laboratorios certificados para garantizar resultados confiables.",
          icono: "lab",
        },
      ],

      parametros: [
        { nombre: "pH", valor: "7.2", rango: "6.5 - 8.5", porcentaje: "70%" },
        {
          nombre: "Cloro Residual",
          valor: "0.5 mg/L",
          rango: "0.3 - 0.6 mg/L",
          porcentaje: "50%",
        },
        {
          nombre: "Turbidez",
          valor: "0.8 NTU",
          rango: "0 - 5 NTU",
          porcentaje: "20%",
        },
        {
          nombre: "Calidad Bacteriológica",
          valor: "Apto",
          rango: "Cumple",
          porcentaje: "100%",
        },
      ],

      infraestructura: [
        {
          titulo: "Nacientes",
          items: [
            "2 concesiones",
            "N1 Caudal concesionado: 39.98 L/s",
            "N2 Caudal concesionado: 32.11 L/s",
          ],
        },
        {
          titulo: "Tanques de almacenamiento",
          items: [
            "3 tanques de almacenamiento",
            "Tanque Zamora: 370 m³",
            "Tanque San Lucas: 72.9 m³",
            "Tanque La Torre: 500 m³",
          ],
        },
        {
          titulo: "Red de distribución",
          items: [
            "Línea de conducción: 7 691,97 metros (7,69 km)",
            "Red de distribución: 43 938,38 metros (43,94 km)",
          ],
        },
      ],

      aforos: {
        fecha: "Abril 2026",
        registros: [
          { lugar: "Naciente rebalse", produccion: "25,60" },
          { lugar: "Quiebra San Gerardo centro rebalse", produccion: "1,86" },
          { lugar: "Tanque Zamora", produccion: "6,06" },
          { lugar: "Tanque San Lucas", produccion: "1,35" },
          { lugar: "Tanque La Torre", produccion: "19,79" },
        ],
        total: "54,66",
      },

      analisisCalidadAgua: {
        titulo: "Análisis de calidad del agua",
        fotos: [],
      },

      ahorro: {
        hogar: [
          "Repara fugas de inmediato",
          "Cierra la llave al cepillarte",
          "Usa la lavadora con carga completa",
          "Instala dispositivos ahorradores",
        ],
        jardin: [
          "Riega en horas de menor calor",
          "Usa sistemas de riego eficientes",
          "Reutiliza el agua cuando sea posible",
          "Planta especies de bajo consumo",
        ],
      },
    });
  }

  return documento;
};

/**
 * Obtiene los datos de la gestión de agua.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el documento de gestión del agua.
 */
const obtenerGestionAgua = async (req, res) => {
  try {
    const documento = await crearDocumentoInicial();
    res.status(200).json(documento);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener gestión del agua",
      error: error.message,
    });
  }
};

/**
 * Actualiza los campos y sub-secciones de la gestión del agua.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express con los datos en req.body.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con el documento actualizado.
 */
const actualizarGestionAgua = async (req, res) => {
  try {
    const documento = await crearDocumentoInicial();

    const {
      hero,
      proceso,
      calidad,
      parametros,
      infraestructura,
      aforos,
      ahorro,
      analisisCalidadAgua,
    } = req.body;

    if (hero) documento.hero = hero;
    if (proceso) documento.proceso = proceso;
    if (calidad) documento.calidad = calidad;
    if (parametros) documento.parametros = parametros;
    if (infraestructura) documento.infraestructura = infraestructura;
    if (aforos) documento.aforos = aforos;
    if (ahorro) documento.ahorro = ahorro;

    if (analisisCalidadAgua) {
      documento.analisisCalidadAgua = {
        ...documento.analisisCalidadAgua.toObject(),
        ...analisisCalidadAgua,
      };
    }

    await documento.save();

    res.status(200).json({
      message: "Gestión del agua actualizada correctamente",
      data: documento,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar gestión del agua",
      error: error.message,
    });
  }
};

/**
 * Sube una nueva fotografía de análisis físico-químico o bacteriológico de agua.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express con el archivo adjunto req.file.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con la lista de fotos actualizada.
 */
const subirFotoAnalisis = async (req, res) => {
  try {
    const documento = await crearDocumentoInicial();

    if (!req.file) {
      return res.status(400).json({ message: "Debe seleccionar una imagen" });
    }

    const rutaImagen = `/uploads/gestion-agua/${req.file.filename}`;

    const fechaActual = new Date().toLocaleDateString("es-CR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    documento.analisisCalidadAgua.fotos.push({
      fecha: fechaActual,
      imagen: rutaImagen,
    });

    await documento.save();

    res.status(201).json({
      message: "Foto de análisis agregada correctamente",
      data: documento.analisisCalidadAgua,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al subir foto de análisis",
      error: error.message,
    });
  }
};

/**
 * Elimina una fotografía específica de análisis de calidad del agua y su archivo físico asociado.
 * @async
 * @param {import('express').Request} req - Objeto de petición de Express con el parámetro fotoId.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<import('express').Response>} Respuesta JSON con la lista de fotos actualizada.
 */
const eliminarFotoAnalisis = async (req, res) => {
  try {
    const documento = await crearDocumentoInicial();
    const { fotoId } = req.params;

    const foto = documento.analisisCalidadAgua.fotos.id(fotoId);

    if (!foto) {
      return res.status(404).json({ message: "Foto no encontrada" });
    }

    const rutaFisica = path.join(
      __dirname,
      "../../",
      foto.imagen.replace(/^\/+/, "")
    );

    if (fs.existsSync(rutaFisica)) {
      fs.unlinkSync(rutaFisica);
    }

    documento.analisisCalidadAgua.fotos.pull(fotoId);
    await documento.save();

    res.status(200).json({
      message: "Foto eliminada correctamente",
      data: documento.analisisCalidadAgua,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar foto",
      error: error.message,
    });
  }
};

module.exports = {
  obtenerGestionAgua,
  actualizarGestionAgua,
  subirFotoAnalisis,
  eliminarFotoAnalisis,
};