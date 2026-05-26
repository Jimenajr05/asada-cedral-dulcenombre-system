/**
 * @file gestionAguaService.js
 * @description Servicios de cliente API utilizando Axios para la gestión del agua (aforos, calidad, fotos de reportes de laboratorio).
 */

import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL || "https://asada-backend.onrender.com";
const API_URL = `${BASE_URL}/api/gestion-agua`;

// Configurar axios para enviar cookies automáticamente
axios.defaults.withCredentials = true;

/**
 * Obtiene la información general de gestión del agua (aforos, parámetros, etc.).
 * @async
 * @function obtenerGestionAgua
 * @returns {Promise<Object>} Datos del agua y nacientes registrados.
 */
export const obtenerGestionAgua = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

/**
 * Actualiza la información cuantitativa o cualitativa del agua.
 * @async
 * @function actualizarGestionAgua
 * @param {Object} data - Objeto con datos actualizados a persistir.
 * @returns {Promise<Object>}
 */
export const actualizarGestionAgua = async (data) => {
  const response = await axios.put(API_URL, data);
  return response.data;
};

/**
 * Sube una captura/foto del análisis físico-químico del agua de laboratorio.
 * @async
 * @function subirFotoAnalisis
 * @param {FormData} formData - Objeto conteniendo el archivo de imagen.
 * @returns {Promise<Object>}
 */
export const subirFotoAnalisis = async (formData) => {
  const response = await axios.post(`${API_URL}/analisis/foto`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * Elimina una foto cargada del reporte de laboratorio.
 * @async
 * @function eliminarFotoAnalisis
 * @param {string} fotoId - Identificador de la imagen a eliminar.
 * @returns {Promise<Object>}
 */
export const eliminarFotoAnalisis = async (fotoId) => {
  const response = await axios.delete(
    `${API_URL}/analisis/foto/${fotoId}`
  );
  return response.data;
};