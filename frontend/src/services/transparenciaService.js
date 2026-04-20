const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/transparencia`;

const getToken = () => localStorage.getItem("token");

const parseResponse = async (response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("El backend no devolvió JSON válido.");
  }
};

// ── Público ───────────────────────────────────────────────────────────────────
export const getTransparencia = async () => {
  const response = await fetch(API_URL);
  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || "Error al obtener transparencia");
  return data;
};

// ── Reuniones ─────────────────────────────────────────────────────────────────
export const createReunion = async (payload) => {
  const response = await fetch(`${API_URL}/reuniones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || "Error al agregar reunión");
  return data;
};

export const updateReunion = async (id, payload) => {
  const response = await fetch(`${API_URL}/reuniones/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || "Error al actualizar reunión");
  return data;
};

export const deleteReunion = async (id) => {
  const response = await fetch(`${API_URL}/reuniones/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || "Error al eliminar reunión");
  return data;
};

// ── Certificados ──────────────────────────────────────────────────────────────
export const createCertificado = async (formData) => {
  const response = await fetch(`${API_URL}/certificados`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData, // FormData — no poner Content-Type manual
  });
  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || "Error al agregar certificado");
  return data;
};

export const deleteCertificado = async (id) => {
  const response = await fetch(`${API_URL}/certificados/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || "Error al eliminar certificado");
  return data;
};