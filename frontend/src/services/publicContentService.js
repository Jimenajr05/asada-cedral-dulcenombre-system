const API_URL =
  `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/contenidos`;

const parseResponse = async (response) => {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("El backend no devolvió JSON válido.");
  }
};

export const getPublicContenidos = async (pagina) => {
  const query = pagina ? `?pagina=${encodeURIComponent(pagina)}` : "";
  const response = await fetch(`${API_URL}${query}`);
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener contenidos");
  }

  return Array.isArray(data) ? data.filter((item) => item.activo) : [];
};