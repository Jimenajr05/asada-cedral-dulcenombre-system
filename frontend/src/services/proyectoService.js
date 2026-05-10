const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// ── Proyectos ──────────────────────────────────────────────────
export const getProyectosPublico = async () => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos`);
  if (!res.ok) throw new Error("Error al obtener proyectos");
  return res.json();
};

export const getProyectosAdmin = async () => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/admin`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al obtener proyectos");
  return res.json();
};

export const createProyecto = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) throw new Error("Error al crear proyecto");
  return res.json();
};

export const updateProyecto = async (id, formData) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/${id}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) throw new Error("Error al actualizar proyecto");
  return res.json();
};

export const deleteProyecto = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar proyecto");
  return res.json();
};

// ── Fotos ──────────────────────────────────────────────────────
export const addFotoProyecto = async (id, formData) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/${id}/fotos`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) throw new Error("Error al subir foto");
  return res.json();
};

export const deleteFotoProyecto = async (id, fotoId) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/${id}/fotos/${fotoId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar foto");
  return res.json();
};

// ── Documentos ─────────────────────────────────────────────────
export const addDocumentoProyecto = async (id, formData) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/${id}/documentos`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) throw new Error("Error al subir documento");
  return res.json();
};

export const deleteDocumentoProyecto = async (id, docId) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/${id}/documentos/${docId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar documento");
  return res.json();
};

// ── Actualizaciones ────────────────────────────────────────────
export const addActualizacion = async (id, data) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/${id}/actualizaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al agregar actualización");
  return res.json();
};

export const updateActualizacion = async (id, actId, data) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/${id}/actualizaciones/${actId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al editar actualización");
  return res.json();
};

export const deleteActualizacion = async (id, actId) => {
  const res = await fetch(`${API_BASE_URL}/api/proyectos/${id}/actualizaciones/${actId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar actualización");
  return res.json();
};

export const BASE_URL = API_BASE_URL;