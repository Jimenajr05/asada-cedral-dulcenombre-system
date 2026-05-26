/**
 * @file proyectoService.js
 * @description Servicios de cliente API para administrar proyectos comunitarios, bitácoras de avance, archivos técnicos y galerías.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://asada-backend.onrender.com";

const getToken = () => localStorage.getItem("token");

/**
 * Obtiene todos los proyectos visibles públicamente.
 * @async
 * @function getProyectosPublico
 * @returns {Promise<Array<Object>>}
 */
export const getProyectosPublico = async () => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos`);
  if (!res.ok) throw new Error("Error al obtener proyectos");
  return res.json();
};

/**
 * Obtiene la lista completa de proyectos para administración (incluyendo borradores).
 * @async
 * @function getProyectosAdmin
 * @returns {Promise<Array<Object>>}
 */
export const getProyectosAdmin = async () => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/admin`, {
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al obtener proyectos");
  return res.json();
};

/**
 * Crea un proyecto base.
 * @async
 * @function createProyecto
 * @param {FormData} formData - Datos de texto del proyecto.
 * @returns {Promise<Object>}
 */
export const createProyecto = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
    body: formData,
  });
  if (!res.ok) throw new Error("Error al crear proyecto");
  return res.json();
};

/**
 * Actualiza los campos textuales y principales de un proyecto.
 * @async
 * @function updateProyecto
 * @param {string} id - ID del proyecto.
 * @param {FormData} formData - Campos modificados del proyecto.
 * @returns {Promise<Object>}
 */
export const updateProyecto = async (id, formData) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/${id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
    body: formData,
  });
  if (!res.ok) throw new Error("Error al actualizar proyecto");
  return res.json();
};

/**
 * Elimina físicamente un proyecto de la base de datos por ID.
 * @async
 * @function deleteProyecto
 * @param {string} id - ID del proyecto.
 * @returns {Promise<Object>}
 */
export const deleteProyecto = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar proyecto");
  return res.json();
};

/**
 * Agrega una fotografía a la galería de avances de un proyecto.
 * @async
 * @function addFotoProyecto
 * @param {string} id - ID del proyecto.
 * @param {FormData} formData - Archivo de imagen adjunto.
 * @returns {Promise<Object>}
 */
export const addFotoProyecto = async (id, formData) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/${id}/fotos`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
    body: formData,
  });
  if (!res.ok) throw new Error("Error al subir foto");
  return res.json();
};

/**
 * Elimina una fotografía específica de la galería de un proyecto.
 * @async
 * @function deleteFotoProyecto
 * @param {string} id - ID del proyecto.
 * @param {string} fotoId - ID de la foto a remover.
 * @returns {Promise<Object>}
 */
export const deleteFotoProyecto = async (id, fotoId) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/${id}/fotos/${fotoId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar foto");
  return res.json();
};

/**
 * Adjunta un plano o documento técnico en PDF, Word o Excel al proyecto.
 * @async
 * @function addDocumentoProyecto
 * @param {string} id - ID del proyecto.
 * @param {FormData} formData - Archivo cargado del documento técnico.
 * @returns {Promise<Object>}
 */
export const addDocumentoProyecto = async (id, formData) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/${id}/documentos`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
    body: formData,
  });
  if (!res.ok) throw new Error("Error al subir documento");
  return res.json();
};

/**
 * Elimina un documento técnico adjunto de un proyecto.
 * @async
 * @function deleteDocumentoProyecto
 * @param {string} id - ID del proyecto.
 * @param {string} docId - ID del documento a eliminar.
 * @returns {Promise<Object>}
 */
export const deleteDocumentoProyecto = async (id, docId) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/${id}/documentos/${docId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar documento");
  return res.json();
};

/**
 * Agrega un avance o bitácora de actualización a la línea de tiempo.
 * @async
 * @function addActualizacion
 * @param {string} id - ID del proyecto.
 * @param {Object} data - Datos de la actualización (titulo, descripcion, fecha).
 * @returns {Promise<Object>}
 */
export const addActualizacion = async (id, data) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/${id}/actualizaciones`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getToken()}`, "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al agregar actualización");
  return res.json();
};

/**
 * Edita un hito o actualización en la línea de tiempo.
 * @async
 * @function updateActualizacion
 * @param {string} id - ID del proyecto.
 * @param {string} actId - ID del hito a actualizar.
 * @param {Object} data - Datos editados.
 * @returns {Promise<Object>}
 */
export const updateActualizacion = async (id, actId, data) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/${id}/actualizaciones/${actId}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${getToken()}`, "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al editar actualización");
  return res.json();
};

/**
 * Elimina una actualización de la bitácora por su ID.
 * @async
 * @function deleteActualizacion
 * @param {string} id - ID del proyecto.
 * @param {string} actId - ID de la actualización a remover.
 * @returns {Promise<Object>}
 */
export const deleteActualizacion = async (id, actId) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/${id}/actualizaciones/${actId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar actualización");
  return res.json();
};

export const BASE_URL = API_BASE_URL;