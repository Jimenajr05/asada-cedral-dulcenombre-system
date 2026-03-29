const API_URL =
  `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/contenidos`;

const getToken = () => localStorage.getItem("token");

const parseResponse = async (response) => {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("El backend no devolvió JSON válido.");
  }
};

export const getContenidos = async (pagina = "") => {
  const query = pagina ? `?pagina=${encodeURIComponent(pagina)}` : "";
  const response = await fetch(`${API_URL}${query}`);
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener contenidos");
  }

  return data;
};

export const createContenido = async (payload) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al crear contenido");
  }

  return data;
};

export const updateContenido = async (id, payload) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar contenido");
  }

  return data;
};

export const toggleContenidoActivo = async (id) => {
  const response = await fetch(`${API_URL}/${id}/toggle`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al cambiar estado");
  }

  return data;
};

export const deleteContenido = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar contenido");
  }

  return data;
};