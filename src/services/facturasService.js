import api from './api';

const facturasService = {
  getAll: async () => {
    const response = await api.get('/facturas');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/facturas/${id}`);
    return response.data;
  },

  create: async (facturaData) => {
    const response = await api.post('/facturas', facturaData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/facturas/${id}`);
    return response.data;
  }
};

export default facturasService;