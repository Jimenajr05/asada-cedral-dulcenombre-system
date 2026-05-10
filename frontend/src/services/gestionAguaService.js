import axios from "axios";

const API_URL = "http://localhost:4000/api/gestion-agua";
export const BASE_URL = "http://localhost:4000";

// Configurar axios para enviar cookies automáticamente
axios.defaults.withCredentials = true;

export const obtenerGestionAgua = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const actualizarGestionAgua = async (data) => {
  const response = await axios.put(API_URL, data);
  return response.data;
};

export const subirFotoAnalisis = async (formData) => {
  const response = await axios.post(`${API_URL}/analisis/foto`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const eliminarFotoAnalisis = async (fotoId) => {
  const response = await axios.delete(
    `${API_URL}/analisis/foto/${fotoId}`
  );
  return response.data;
};