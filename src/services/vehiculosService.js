import api from './api';

const vehiculosService = {
  getAll: async () => {
    const response = await api.get('/vehiculos');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/vehiculos/${id}`);
    return response.data;
  },

  getByCliente: async (idCliente) => {
    const response = await api.get(`/vehiculos/cliente/${idCliente}`);
    return response.data;
  },

  create: async (vehiculoData) => {
    const response = await api.post('/vehiculos', vehiculoData);
    return response.data;
  },

  update: async (id, vehiculoData) => {
    const response = await api.put(`/vehiculos/${id}`, vehiculoData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/vehiculos/${id}`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get(`/vehiculos/search?q=${query}`);
    return response.data;
  },
};

export default vehiculosService;