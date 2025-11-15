import api from './api';

const serviciosService = {
  getAll: async (soloActivos = false) => {
    const response = await api.get(`/servicios${soloActivos ? '?activo=true' : ''}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/servicios/${id}`);
    return response.data;
  },

  create: async (servicioData) => {
    const response = await api.post('/servicios', servicioData);
    return response.data;
  },

  update: async (id, servicioData) => {
    const response = await api.put(`/servicios/${id}`, servicioData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/servicios/${id}`);
    return response.data;
  },

  toggle: async (id) => {
    const response = await api.patch(`/servicios/${id}/toggle`);
    return response.data;
  }
};

export default serviciosService;