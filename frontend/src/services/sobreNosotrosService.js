/**
 * @file sobreNosotrosService.js
 * @description Servicios de cliente API para administrar información de junta directiva, periodos institucionales y métricas de cobertura.
 */

const API_URL = `${import.meta.env.VITE_API_URL || "https://asada-backend.onrender.com"}/api/sobre-nosotros`;

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
 * Obtiene la información de periodos, junta directiva y cobertura.
 * @async
 * @function getSobreNosotros
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const getSobreNosotros = async () => {
  const response = await fetch(API_URL);
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener Sobre Nosotros");
  }

  return data;
};

/**
 * Actualiza el periodo general y vigencia de la junta directiva.
 * @async
 * @function updateSobreNosotros
 * @param {Object} payload - Rango de fechas de vigencia.
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const updateSobreNosotros = async (payload) => {
  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar Sobre Nosotros");
  }

  return data;
};

/**
 * Agrega un nuevo miembro directivo con su fotografía.
 * @async
 * @function addMiembro
 * @param {FormData} formData - Datos y archivo de imagen del miembro.
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const addMiembro = async (formData) => {
  const response = await fetch(`${API_URL}/miembros`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
    body: formData,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al agregar miembro");
  }

  return data;
};

/**
 * Actualiza datos de un miembro directivo por su índice posicional.
 * @async
 * @function updateMiembro
 * @param {number} index - Posición del miembro en la lista.
 * @param {FormData} formData - Datos y foto actualizada.
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const updateMiembro = async (index, formData) => {
  const response = await fetch(`${API_URL}/miembros/${index}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
    body: formData,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar miembro");
  }

  return data;
};

/**
 * Remueve un miembro de la junta por su índice posicional.
 * @async
 * @function deleteMiembro
 * @param {number} index - Posición del miembro.
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const deleteMiembro = async (index) => {
  const response = await fetch(`${API_URL}/miembros/${index}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar miembro");
  }

  return data;
};

/**
 * Agrega un nuevo registro estadístico de cobertura de agua potable.
 * @async
 * @function addCobertura
 * @param {Object} payload - Datos de cobertura (año, conexiones, porcentaje).
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const addCobertura = async (payload) => {
  const response = await fetch(`${API_URL}/cobertura`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al agregar cobertura");
  }

  return data;
};

/**
 * Actualiza un hito estadístico de cobertura de la lista.
 * @async
 * @function updateCobertura
 * @param {number} index - Posición en la lista.
 * @param {Object} payload - Nuevas métricas de cobertura.
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const updateCobertura = async (index, payload) => {
  const response = await fetch(`${API_URL}/cobertura/${index}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar cobertura");
  }

  return data;
};

/**
 * Remueve un hito estadístico de cobertura.
 * @async
 * @function deleteCobertura
 * @param {number} index - Posición de cobertura.
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const deleteCobertura = async (index) => {
  const response = await fetch(`${API_URL}/cobertura/${index}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar cobertura");
  }

  return data;
};