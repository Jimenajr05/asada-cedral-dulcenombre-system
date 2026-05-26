/**
 * @file tareaService.js
 * @description Servicios de cliente API para administrar la agenda/lista de tareas pendientes interna de los administradores.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://asada-backend.onrender.com";

const getToken = () => localStorage.getItem("token");

/**
 * Obtiene todas las tareas asociadas al usuario administrador autenticado.
 * @async
 * @function getTareas
 * @returns {Promise<Array<Object>>}
 */
export const getTareas = async () => {
  const res = await fetch(`${API_BASE_URL}/api/tareas`, {
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al obtener tareas");
  return res.json();
};

/**
 * Crea una nueva tarea en la lista de pendientes.
 * @async
 * @function crearTarea
 * @param {Object} data - Información de la tarea (titulo, descripcion, prioridad, etc.).
 * @returns {Promise<Object>}
 */
export const crearTarea = async (data) => {
  const res = await fetch(`${API_BASE_URL}/api/tareas`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getToken()}`, "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear tarea");
  return res.json();
};

/**
 * Alterna el estado completado de una tarea por su ID.
 * @async
 * @function toggleTarea
 * @param {string} id - Identificador de la tarea.
 * @returns {Promise<Object>}
 */
export const toggleTarea = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/tareas/${id}/toggle`, {
    method: "PATCH",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al actualizar tarea");
  return res.json();
};

/**
 * Elimina de manera física una tarea de la base de datos.
 * @async
 * @function eliminarTarea
 * @param {string} id - Identificador de la tarea a remover.
 * @returns {Promise<Object>}
 */
export const eliminarTarea = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/tareas/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar tarea");
  return res.json();
};