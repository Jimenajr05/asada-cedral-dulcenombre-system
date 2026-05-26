/**
 * @file avisoService.js
 * @description Servicios de cliente API para el CRUD de boletines y avisos de la comunidad.
 */

const API_URL = `${import.meta.env.VITE_API_URL || "https://asada-backend.onrender.com"}/api/avisos`;

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
 * Recupera el listado de avisos comunitarios activos.
 * @async
 * @function getAvisos
 * @returns {Promise<Array<Object>>} Lista de boletines informativos.
 * @throws {Error}
 */
export const getAvisos = async () => {
  const response = await fetch(API_URL);
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener avisos");
  }

  return data;
};

/**
 * Crea un nuevo aviso o boletín (admite imagen cargada en base64/URL).
 * @async
 * @function createAviso
 * @param {Object} aviso - Datos del aviso (titulo, descripcion, tipo, etc.).
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const createAviso = async (aviso) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(aviso),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al crear aviso");
  }

  return data;
};

/**
 * Actualiza la información de un aviso existente por su ID.
 * @async
 * @function updateAviso
 * @param {string} id - Identificador del aviso a modificar.
 * @param {Object} aviso - Campos actualizados del aviso.
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const updateAviso = async (id, aviso) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(aviso),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar aviso");
  }

  return data;
};

/**
 * Elimina físicamente un aviso por su ID.
 * @async
 * @function deleteAviso
 * @param {string} id - Identificador del aviso a eliminar.
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const deleteAviso = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar aviso");
  }

  return data;
};