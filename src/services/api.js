import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL, // Axios ahora usa la URL de Railway
  headers: {
    "Content-Type": "application/json",
  },
});
// ... (El resto del código permanece igual)

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
