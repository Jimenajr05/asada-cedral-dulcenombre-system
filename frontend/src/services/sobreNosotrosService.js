const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:4000"
}/api/sobre-nosotros`;

const parseResponse = async (response) => {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("El backend no devolvió JSON válido.");
  }
};

export const getSobreNosotros = async () => {
  const response = await fetch(API_URL);
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener Sobre Nosotros");
  }

  return data;
};

export const updateSobreNosotros = async (payload) => {
  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar Sobre Nosotros");
  }

  return data;
};

export const addMiembro = async (formData) => {
  const response = await fetch(`${API_URL}/miembros`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al agregar miembro");
  }

  return data;
};

export const updateMiembro = async (index, formData) => {
  const response = await fetch(`${API_URL}/miembros/${index}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar miembro");
  }

  return data;
};

export const deleteMiembro = async (index) => {
  const response = await fetch(`${API_URL}/miembros/${index}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar miembro");
  }

  return data;
};

export const addCobertura = async (payload) => {
  const response = await fetch(`${API_URL}/cobertura`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al agregar cobertura");
  }

  return data;
};

export const updateCobertura = async (index, payload) => {
  const response = await fetch(`${API_URL}/cobertura/${index}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar cobertura");
  }

  return data;
};

export const deleteCobertura = async (index) => {
  const response = await fetch(`${API_URL}/cobertura/${index}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar cobertura");
  }

  return data;
};