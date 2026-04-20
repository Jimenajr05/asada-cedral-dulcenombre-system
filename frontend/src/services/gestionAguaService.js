import axios from "axios";

const API_URL = "http://localhost:4000/api/gestion-agua";
export const BASE_URL = "http://localhost:4000";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const obtenerGestionAgua = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const actualizarGestionAgua = async (data) => {
  const response = await axios.put(API_URL, data, getAuthConfig());
  return response.data;
};

export const subirFotoAnalisis = async (formData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${API_URL}/analisis/foto`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const eliminarFotoAnalisis = async (fotoId) => {
  const response = await axios.delete(
    `${API_URL}/analisis/foto/${fotoId}`,
    getAuthConfig()
  );
  return response.data;
};