const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const getToken = () => localStorage.getItem("token");


export const getTareas = async () => {
  const res = await fetch(`${API_BASE_URL}/api/tareas`, {
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al obtener tareas");
  return res.json();
};

export const crearTarea = async (data) => {
  const res = await fetch(`${API_BASE_URL}/api/tareas`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getToken()}`, "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear tarea");
  return res.json();
};

export const toggleTarea = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/tareas/${id}/toggle`, {
    method: "PATCH",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al actualizar tarea");
  return res.json();
};

export const eliminarTarea = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/tareas/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar tarea");
  return res.json();
};