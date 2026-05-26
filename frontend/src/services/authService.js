/**
 * @file authService.js
 * @description Servicios de cliente API para gestionar la autenticación de administradores, comunicación con backend y cookies de sesión.
 */

const API_URL = `${import.meta.env.VITE_API_URL || "https://asada-backend.onrender.com"}/api/auth`;

/**
 * Registra un nuevo usuario administrador.
 * @async
 * @function registerAdmin
 * @param {Object} formData - Información de registro del administrador.
 * @returns {Promise<Object>} Respuesta JSON con datos del usuario creado.
 * @throws {Error} Mensaje de error de validación o fallo de servidor.
 */
export const registerAdmin = async (formData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al registrar");
  }

  return data;
};

/**
 * Inicia sesión para un administrador.
 * @async
 * @function loginAdmin
 * @param {Object} formData - Credenciales del administrador (email y contraseña).
 * @returns {Promise<Object>} Datos del usuario administrador autenticado.
 * @throws {Error} Mensaje de credenciales erróneas o bloqueo temporal.
 */
export const loginAdmin = async (formData) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al iniciar sesión");
  }

  return data;
};

/**
 * Cierra la sesión activa del administrador limpiando la cookie JWT.
 * @async
 * @function logoutAdmin
 * @returns {Promise<Object>} Respuesta con mensaje de confirmación de salida.
 * @throws {Error}
 */
export const logoutAdmin = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al cerrar sesión");
  }

  return data;
};

/**
 * Recupera el perfil del administrador autenticado mediante la cookie JWT enviada automáticamente.
 * @async
 * @function getProfile
 * @returns {Promise<Object>} Datos del perfil del administrador.
 * @throws {Error}
 */
export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/profile`, {
    headers,
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al verificar sesión");
  }

  return data;
};