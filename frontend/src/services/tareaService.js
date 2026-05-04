const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const getToken = () => localStorage.getItem("token");
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export const getTareas = async () => {
  const res = await fetch(`${API_BASE_URL}/api/tareas`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Error al obtener tareas");
  return res.json();
};

export const crearTarea = async (data) => {
  const res = await fetch(`${API_BASE_URL}/api/tareas`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear tarea");
  return res.json();
};

export const toggleTarea = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/tareas/${id}/toggle`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al actualizar tarea");
  return res.json();
};

export const eliminarTarea = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/tareas/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar tarea");
  return res.json();
};