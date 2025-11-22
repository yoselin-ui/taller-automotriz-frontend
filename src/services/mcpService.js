import axios from "axios";

const MCP_URL = process.env.REACT_APP_MCP_URL || "http://localhost:8080";

const mcpService = {
  // Obtener análisis completo del negocio
  getAnalysis: async () => {
    try {
      const response = await axios.get(`${MCP_URL}/aiops/check-business`, {
        timeout: 15000, // 15 segundos (Gemini puede tardar)
      });
      return response.data;
    } catch (error) {
      console.error("Error obteniendo análisis MCP:", error);
      throw error;
    }
  },

  // Health check del servicio MCP
  getHealth: async () => {
    try {
      const response = await axios.get(`${MCP_URL}/health`, {
        timeout: 5000,
      });
      return response.data;
    } catch (error) {
      console.error("Error en health check MCP:", error);
      throw error;
    }
  },
};

export default mcpService;
