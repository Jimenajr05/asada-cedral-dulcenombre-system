/**
 * @file sostenibilidadService.js
 * @description Servicios de cliente API para administrar galerías de Cultura Hídrica, Mantenimiento preventivo e hidrantes.
 */

const API_URL = `${import.meta.env.VITE_API_URL || "https://asada-backend.onrender.com"}/api/sostenibilidad`;

const getToken = () => localStorage.getItem("token");

/**
 * Parsea y procesa la respuesta HTTP verificando que sea un formato JSON válido.
 * @param {Response} response - Objeto de respuesta HTTP de fetch.
 * @returns {Promise<Object>} Datos decodificados en JSON.
 */
const parseResponse = async (response) => {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("El backend no devolvió JSON válido.");
  }
};

/**
 * Recupera los datos de sostenibilidad pública (galerías e hidrantes).
 * @async
 * @function getSostenibilidad
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const getSostenibilidad = async () => {
  const response = await fetch(API_URL);
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener sostenibilidad");
  }

  return data;
};

/**
 * Obtiene la información completa de sostenibilidad para la sección administrativa.
 * @async
 * @function getSostenibilidadAdmin
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const getSostenibilidadAdmin = async () => {
  const response = await fetch(`${API_URL}/admin`, {
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener sostenibilidad");
  }

  return data;
};

/**
 * Actualiza la cantidad total de hidrantes instalados en la comunidad.
 * @async
 * @function updateTotalHidrantes
 * @param {Object} payload - Objeto conteniendo el total de hidrantes.
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const updateTotalHidrantes = async (payload) => {
  const response = await fetch(`${API_URL}/hidrantes/total`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar total de hidrantes");
  }

  return data;
};

/**
 * Agrega una nueva imagen con su texto alternativo a una galería ecológica específica.
 * @async
 * @function addImagenGaleria
 * @param {string} galeria - Identificador de la galería ("culturaHidrica" o "mantenimiento").
 * @param {FormData} formData - Archivo de imagen cargado y alt.
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const addImagenGaleria = async (galeria, formData) => {
  const response = await fetch(`${API_URL}/galerias/${galeria}/imagenes`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
    body: formData,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al agregar imagen");
  }

  return data;
};

/**
 * Actualiza o reemplaza una imagen de una galería ecológica por su índice posicional.
 * @async
 * @function updateImagenGaleria
 * @param {string} galeria - Nombre de la galería.
 * @param {number} index - Índice de la imagen a modificar.
 * @param {FormData} formData - Nueva imagen cargada y/o texto alternativo.
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const updateImagenGaleria = async (galeria, index, formData) => {
  const response = await fetch(`${API_URL}/galerias/${galeria}/imagenes/${index}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
    body: formData,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar imagen");
  }

  return data;
};

/**
 * Elimina una imagen de una galería ecológica por su índice posicional.
 * @async
 * @function deleteImagenGaleria
 * @param {string} galeria - Nombre de la galería.
 * @param {number} index - Índice de la imagen.
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const deleteImagenGaleria = async (galeria, index) => {
  const response = await fetch(`${API_URL}/galerias/${galeria}/imagenes/${index}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar imagen");
  }

  return data;
};