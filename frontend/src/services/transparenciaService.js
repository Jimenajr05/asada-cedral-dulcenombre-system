/**
 * @file transparenciaService.js
 * @description Servicios de cliente API para la gestión de transparencia (actas de asambleas, minutas y certificados/galardones).
 */

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/transparencia`;

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
  } catch {
    throw new Error("El backend no devolvió JSON válido.");
  }
};

/**
 * Obtiene la información general de transparencia (reuniones y galardones).
 * @async
 * @function getTransparencia
 * @returns {Promise<Object>}
 */
export const getTransparencia = async () => {
  const response = await fetch(API_URL);
  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || "Error al obtener transparencia");
  return data;
};

/**
 * Agrega un registro de reunión/asamblea en el archivo de transparencia.
 * @async
 * @function createReunion
 * @param {Object} payload - Datos de la reunión (fecha, tipo, actaURL, etc.).
 * @returns {Promise<Object>}
 */
export const createReunion = async (payload) => {
  const response = await fetch(`${API_URL}/reuniones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || "Error al agregar reunión");
  return data;
};

/**
 * Actualiza los datos de una reunión registrada por su ID.
 * @async
 * @function updateReunion
 * @param {string} id - ID de la reunión.
 * @param {Object} payload - Datos modificados.
 * @returns {Promise<Object>}
 */
export const updateReunion = async (id, payload) => {
  const response = await fetch(`${API_URL}/reuniones/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || "Error al actualizar reunión");
  return data;
};

/**
 * Elimina una reunión del listado por su ID.
 * @async
 * @function deleteReunion
 * @param {string} id - ID de la reunión a remover.
 * @returns {Promise<Object>}
 */
export const deleteReunion = async (id) => {
  const response = await fetch(`${API_URL}/reuniones/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    },
    credentials: "include",
  });
  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || "Error al eliminar reunión");
  return data;
};

/**
 * Registra un nuevo galardón o certificado de calidad con imagen de evidencia.
 * @async
 * @function createCertificado
 * @param {FormData} formData - Datos y archivo de imagen del galardón.
 * @returns {Promise<Object>}
 */
export const createCertificado = async (formData) => {
  const response = await fetch(`${API_URL}/certificados`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    },
    credentials: "include",
    body: formData,
  });
  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || "Error al agregar certificado");
  return data;
};

/**
 * Elimina de manera física un galardón del sistema por su ID.
 * @async
 * @function deleteCertificado
 * @param {string} id - ID del certificado.
 * @returns {Promise<Object>}
 */
export const deleteCertificado = async (id) => {
  const response = await fetch(`${API_URL}/certificados/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    },
    credentials: "include",
  });
  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || "Error al eliminar certificado");
  return data;
};

/**
 * Actualiza el título o reemplaza la imagen de un galardón.
 * @async
 * @function updateCertificado
 * @param {string} id - ID del certificado.
 * @param {FormData} formData - Datos de actualización.
 * @returns {Promise<Object>}
 */
export const updateCertificado = async (id, formData) => {
  const response = await fetch(`${API_URL}/certificados/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    },
    credentials: "include",
    body: formData,
  });
  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || "Error al actualizar certificado");
  return data;
};