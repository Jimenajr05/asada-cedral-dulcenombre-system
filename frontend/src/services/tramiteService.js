const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:4000"
}/api/tramites`;

const parseResponse = async (response) => {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("El backend no devolvió JSON válido.");
  }
};

export const getTramites = async () => {
  const response = await fetch(API_URL);
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener trámites");
  }

  return data;
};

export const getTramitesAdmin = async () => {
  const response = await fetch(`${API_URL}/admin`, {
    credentials: "include",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener trámites");
  }

  return data;
};

export const createTramite = async (formData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al crear trámite");
  }

  return data;
};

export const updateTramite = async (id, formData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar trámite");
  }

  return data;
};

export const deleteTramite = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar trámite");
  }

  return data;
};