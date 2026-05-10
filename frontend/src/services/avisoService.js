const API_URL = "http://localhost:4000/api/avisos";

const parseResponse = async (response) => {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("El backend no devolvió JSON válido.");
  }
};

export const getAvisos = async () => {
  const response = await fetch(API_URL);
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener avisos");
  }

  return data;
};

export const createAviso = async (aviso) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(aviso),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al crear aviso");
  }

  return data;
};

export const updateAviso = async (id, aviso) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(aviso),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar aviso");
  }

  return data;
};

export const deleteAviso = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar aviso");
  }

  return data;
};