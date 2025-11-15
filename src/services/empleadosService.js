import api from './api';

const empleadosService = {
  getAll: async (soloActivos = false) => {
    const response = await api.get(`/empleados${soloActivos ? '?activo=true' : ''}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/empleados/${id}`);
    return response.data;
  },

  create: async (empleadoData) => {
    const response = await api.post('/empleados', empleadoData);
    return response.data;
  },

  update: async (id, empleadoData) => {
    const response = await api.put(`/empleados/${id}`, empleadoData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/empleados/${id}`);
    return response.data;
  },

  toggle: async (id) => {
    const response = await api.patch(`/empleados/${id}/toggle`);
    return response.data;
  }
};

export default empleadosService;