/**
 * @file userService.js
 * @description Servicios de cliente API para el CRUD de usuarios administradores.
 */

const API_URL = `${import.meta.env.VITE_API_URL || "https://asada-backend.onrender.com"}/api/users`;

const getToken = () => localStorage.getItem("token");

const parseResponse = async (response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("El backend no devolvió JSON válido.");
  }
};

export const getUsers = async () => {
  const response = await fetch(API_URL, {
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });
  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || "Error al obtener usuarios");
  return data.users || [];
};

export const createUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });
  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || "Error al crear usuario");
  return data;
};

export const updateUser = async (id, userData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });
  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || "Error al actualizar usuario");
  return data;
};

export const updatePassword = async (id, newPassword) => {
  const response = await fetch(`${API_URL}/${id}/password`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ newPassword }),
  });
  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || "Error al actualizar contraseña");
  return data;
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` },
    credentials: "include",
  });
  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || "Error al eliminar usuario");
  return data;
};
