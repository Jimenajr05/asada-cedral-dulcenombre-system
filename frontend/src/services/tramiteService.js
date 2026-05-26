/**
 * @file tramiteService.js
 * @description Servicios de cliente API para gestionar los requisitos de trámites oficiales y adjuntar formularios descargables PDF.
 */

const API_URL = `${import.meta.env.VITE_API_URL || "https://asada-backend.onrender.com"}/api/tramites`;

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
 * Obtiene la lista de trámites activos visibles públicamente.
 * @async
 * @function getTramites
 * @returns {Promise<Array<Object>>}
 * @throws {Error}
 */
export const getTramites = async () => {
  const response = await fetch(API_URL);
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener trámites");
  }

  return data;
};

/**
 * Obtiene todos los trámites registrados incluyendo borradores o archivados.
 * @async
 * @function getTramitesAdmin
 * @returns {Promise<Array<Object>>}
 * @throws {Error}
 */
export const getTramitesAdmin = async () => {
  const response = await fetch(`${API_URL}/admin`, {
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener trámites");
  }

  return data;
};

/**
 * Crea un trámite con su respectivo formulario PDF cargado.
 * @async
 * @function createTramite
 * @param {FormData} formData - Datos de texto y archivo binario del formulario PDF.
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const createTramite = async (formData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
    body: formData,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al crear trámite");
  }

  return data;
};

/**
 * Actualiza textos o reemplaza el archivo de formulario PDF de un trámite.
 * @async
 * @function updateTramite
 * @param {string} id - ID del trámite.
 * @param {FormData} formData - Datos y/o archivo nuevo.
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const updateTramite = async (id, formData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
    body: formData,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar trámite");
  }

  return data;
};

/**
 * Elimina físicamente un trámite de la base de datos.
 * @async
 * @function deleteTramite
 * @param {string} id - ID del trámite a remover.
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const deleteTramite = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar trámite");
  }

  return data;
};