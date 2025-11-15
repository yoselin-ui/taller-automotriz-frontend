import api from './api';

const ordenesService = {
  getAll: async (estado = null) => {
    const url = estado ? `/ordenes?estado=${estado}` : '/ordenes';
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/ordenes/${id}`);
    return response.data;
  },

  create: async (ordenData) => {
    const response = await api.post('/ordenes', ordenData);
    return response.data;
  },

  update: async (id, ordenData) => {
    const response = await api.put(`/ordenes/${id}`, ordenData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/ordenes/${id}`);
    return response.data;
  }
};

export default ordenesService;