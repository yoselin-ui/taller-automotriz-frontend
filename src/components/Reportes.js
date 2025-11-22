import React, { useState, useEffect } from "react";
import mcpService from "../services/mcpService";

export default function Reportes() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    loadMetrics();

    // Auto-actualizar cada 2 minutos
    const interval = setInterval(() => {
      loadMetrics(true); // true = silencioso (sin loading)
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      const data = await mcpService.getAnalysis();
      setMetrics(data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Error cargando métricas:", err);
      setError(
        err.response?.data?.message ||
          "Error al conectar con el servicio de análisis."
      );
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const formatTimeAgo = (date) => {
    if (!date) return "Nunca";
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return "Hace unos segundos";
    if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} minutos`;
    if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} horas`;
    return `Hace ${Math.floor(seconds / 86400)} días`;
  };

  // ⭐ NUEVA FUNCIÓN: Verificar si las métricas del sistema están disponibles
  const hasSystemMetrics = () => {
    return (
      metrics?.systemMetrics?.cpu_usage !== "N/A" &&
      metrics?.systemMetrics?.memory_available !== "N/A" &&
      metrics?.systemMetrics?.disk_usage !== "N/A"
    );
  };

  if (loading) {
    return (
      <div className="reportes-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando métricas del negocio...</p>
          <p className="loading-subtitle">Conectando con MCP-AIOps...</p>
        </div>
        <style jsx>{`
          .reportes-container {
            animation: fadeIn 0.5s ease;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .loading-state {
            text-align: center;
            padding: 100px 20px;
          }
          .spinner {
            width: 60px;
            height: 60px;
            border: 4px solid #333;
            border-top-color: #e50914;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 24px;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          .loading-state p {
            font-size: 18px;
            color: #fff;
            margin-bottom: 8px;
          }
          .loading-subtitle {
            font-size: 14px;
            color: #999;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reportes-container">
        <div className="page-header-small">
          <h1>📊 Reportes y Análisis</h1>
          <button className="btn-primary" onClick={() => loadMetrics()}>
            🔄 Reintentar
          </button>
        </div>
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>No se pudo conectar con MCP</h2>
          <p>{error}</p>
          <div className="error-details">
            <h3>🔧 Verifica la conexión:</h3>
            <ul>
              <li>El servicio MCP debe estar activo en Render</li>
              <li>Revisa los logs en el dashboard de Render</li>
              <li>Verifica que las variables de entorno estén configuradas</li>
            </ul>
          </div>
        </div>
        <style jsx>{`
          .reportes-container {
            animation: fadeIn 0.5s ease;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .page-header-small {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
          }
          .page-header-small h1 {
            font-size: 36px;
            font-weight: 900;
          }
          .btn-primary {
            background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s;
          }
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(229, 9, 20, 0.4);
          }
          .error-state {
            background: #1a1a1a;
            border: 2px solid #f44336;
            border-radius: 16px;
            padding: 60px 40px;
            text-align: center;
          }
          .error-icon {
            font-size: 80px;
            margin-bottom: 24px;
          }
          .error-state h2 {
            font-size: 28px;
            color: #f44336;
            margin-bottom: 16px;
          }
          .error-state p {
            font-size: 16px;
            color: #999;
            margin-bottom: 32px;
          }
          .error-details {
            background: #0a0a0a;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 24px;
            text-align: left;
            max-width: 700px;
            margin: 0 auto;
          }
          .error-details h3 {
            font-size: 18px;
            color: #e50914;
            margin-bottom: 16px;
          }
          .error-details ul {
            padding-left: 24px;
          }
          .error-details li {
            padding: 8px 0;
            color: #ddd;
            font-size: 14px;
            line-height: 1.6;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="reportes-container">
      <div className="page-header-small">
        <div>
          <h1>📊 Reportes y Análisis</h1>
          <p className="subtitle">Métricas en Tiempo Real del Taller</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => loadMetrics()}
          disabled={loading}
        >
          {loading ? "⏳ Cargando..." : "🔄 Actualizar"}
        </button>
      </div>

      {/* RESUMEN GENERAL */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon">📋</div>
          <div className="summary-content">
            <div className="summary-value">
              {metrics.businessMetrics?.ordenes_pendientes || 0}
            </div>
            <div className="summary-label">Órdenes Pendientes</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">🔧</div>
          <div className="summary-content">
            <div className="summary-value">
              {metrics.businessMetrics?.ordenes_en_proceso || 0}
            </div>
            <div className="summary-label">En Proceso</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <div className="summary-value">
              {metrics.businessMetrics?.ordenes_completadas || 0}
            </div>
            <div className="summary-label">Completadas</div>
          </div>
        </div>
        <div className="summary-card highlight">
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <div className="summary-value money">
              $
              {(metrics.businessMetrics?.ingresos_hoy || 0).toLocaleString(
                "es-GT",
                { minimumFractionDigits: 2 }
              )}
            </div>
            <div className="summary-label">Ingresos del Día</div>
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        {/* MÉTRICAS DE NEGOCIO */}
        <div className="metrics-section full-width">
          <h3>📈 Métricas de Negocio</h3>
          <div className="metrics-list">
            <div className="metric-row">
              <span className="metric-label">Total Clientes</span>
              <span className="metric-value">
                {metrics.businessMetrics?.total_clientes || 0}
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Total Vehículos</span>
              <span className="metric-value">
                {metrics.businessMetrics?.total_vehiculos || 0}
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Empleados Activos</span>
              <span className="metric-value">
                {metrics.businessMetrics?.empleados_activos || 0}
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Servicios Activos</span>
              <span className="metric-value">
                {metrics.businessMetrics?.servicios_activos || 0}
              </span>
            </div>
          </div>
        </div>

        {/* ⭐ MÉTRICAS DEL SISTEMA - SOLO SI ESTÁN DISPONIBLES */}
        {hasSystemMetrics() && (
          <div className="metrics-section">
            <h3>💻 Métricas del Sistema</h3>
            <div className="metrics-list">
              <div className="metric-row">
                <span className="metric-label">Uso de CPU</span>
                <span className="metric-value">
                  {metrics.systemMetrics?.cpu_usage}
                </span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Memoria Disponible</span>
                <span className="metric-value">
                  {metrics.systemMetrics?.memory_available}
                </span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Uso de Disco</span>
                <span className="metric-value">
                  {metrics.systemMetrics?.disk_usage}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="info-footer">
        <p>📅 Última actualización: {formatTimeAgo(lastUpdate)}</p>
        <p>🕐 {lastUpdate?.toLocaleString()}</p>
        <p className="version">
          Actualización automática cada 2 minutos | MCP-AIOps v1.0.0
        </p>
      </div>

      <style jsx>{`
        .reportes-container {
          animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .page-header-small {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        .page-header-small h1 {
          font-size: 36px;
          font-weight: 900;
          margin-bottom: 4px;
        }
        .subtitle {
          font-size: 14px;
          color: #999;
        }

        .btn-primary {
          background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
          white-space: nowrap;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(229, 9, 20, 0.4);
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* SUMMARY CARDS */
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }
        .summary-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 32px;
          display: flex;
          align-items: center;
          gap: 24px;
          transition: all 0.3s;
          animation: slideUp 0.5s ease;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .summary-card:hover {
          transform: translateY(-4px);
          border-color: #e50914;
          box-shadow: 0 8px 32px rgba(229, 9, 20, 0.2);
        }
        .summary-card.highlight {
          background: linear-gradient(
            135deg,
            rgba(229, 9, 20, 0.2) 0%,
            rgba(20, 20, 20, 0.9) 100%
          );
          border-color: #e50914;
        }
        .summary-icon {
          width: 64px;
          height: 64px;
          background: rgba(229, 9, 20, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          flex-shrink: 0;
        }
        .summary-content {
          flex: 1;
        }
        .summary-value {
          font-size: 36px;
          font-weight: 900;
          color: #fff;
          margin-bottom: 4px;
        }
        .summary-value.money {
          color: #4caf50;
        }
        .summary-label {
          font-size: 13px;
          color: #999;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 1px;
        }

        /* METRICS GRID */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }
        .metrics-section {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 32px;
          animation: slideUp 0.6s ease;
        }
        /* ⭐ Si solo hay métricas de negocio, ocupar todo el ancho */
        .metrics-section.full-width {
          grid-column: 1 / -1;
        }
        .metrics-section h3 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #2a2a2a;
        }

        .metrics-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .metric-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(229, 9, 20, 0.05);
          border-radius: 8px;
          transition: all 0.2s;
        }
        .metric-row:hover {
          background: rgba(229, 9, 20, 0.1);
          transform: translateX(4px);
        }
        .metric-label {
          font-size: 14px;
          color: #999;
          font-weight: 600;
        }
        .metric-value {
          font-size: 20px;
          font-weight: 900;
          color: #fff;
        }

        /* FOOTER */
        .info-footer {
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
        }
        .info-footer p {
          margin: 8px 0;
          color: #999;
          font-size: 14px;
        }
        .version {
          font-size: 12px;
          color: #666;
          margin-top: 16px;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .page-header-small {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .summary-cards {
            grid-template-columns: 1fr;
          }
          .metrics-grid {
            grid-template-columns: 1fr;
          }
          .summary-card {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
}
