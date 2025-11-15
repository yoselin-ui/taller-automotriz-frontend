import api from './api';

const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getOrdenesRecientes: async (limit = 10) => {
    const response = await api.get(`/dashboard/ordenes-recientes?limit=${limit}`);
    return response.data;
  },

  getClientesRecientes: async (limit = 10) => {
    const response = await api.get(`/dashboard/clientes-recientes?limit=${limit}`);
    return response.data;
  },

  getVentasMensuales: async () => {
    const response = await api.get('/dashboard/ventas-mensuales');
    return response.data;
  },

  getComparacionMensual: async () => {
    const response = await api.get('/dashboard/comparacion-mensual');
    return response.data;
  },
};

export default dashboardService;