const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:4000"
}/api/sostenibilidad`;

const getToken = () => localStorage.getItem("token");

const parseResponse = async (response) => {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("El backend no devolvió JSON válido.");
  }
};

export const getSostenibilidad = async () => {
  const response = await fetch(API_URL);
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener sostenibilidad");
  }

  return data;
};

export const getSostenibilidadAdmin = async () => {
  const response = await fetch(`${API_URL}/admin`, {
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener sostenibilidad");
  }

  return data;
};

export const updateTotalHidrantes = async (payload) => {
  const response = await fetch(`${API_URL}/hidrantes/total`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar total de hidrantes");
  }

  return data;
};

export const addImagenGaleria = async (galeria, formData) => {
  const response = await fetch(`${API_URL}/galerias/${galeria}/imagenes`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
    body: formData,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al agregar imagen");
  }

  return data;
};

export const updateImagenGaleria = async (galeria, index, formData) => {
  const response = await fetch(`${API_URL}/galerias/${galeria}/imagenes/${index}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
    body: formData,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar imagen");
  }

  return data;
};

export const deleteImagenGaleria = async (galeria, index) => {
  const response = await fetch(`${API_URL}/galerias/${galeria}/imagenes/${index}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar imagen");
  }

  return data;
};