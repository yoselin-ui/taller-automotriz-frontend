import React, { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';

export default function Dashboard() {
  const [stats, setStats] = useState({
    clientes: { total: 0 },
    vehiculos: { total: 0 },
    ordenes: { total: 0, pendientes: 0, en_proceso: 0 },
    ventas: { del_mes: 0 }
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, ordenesData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getOrdenesRecientes(4)
      ]);
      setStats(statsData);
      setRecentOrders(ordenesData);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando dashboard...</div>;
  }

  const statsCards = [
    { icon: '👥', label: 'Clientes Activos', value: stats.clientes.total, color: '#2196F3' },
    { icon: '🚗', label: 'Vehículos Registrados', value: stats.vehiculos.total, color: '#4CAF50' },
    { icon: '📋', label: 'Órdenes Activas', value: stats.ordenes.pendientes + stats.ordenes.en_proceso, color: '#FF9800' },
    { icon: '💰', label: 'Facturación Mes', value: `$${stats.ventas.del_mes.toLocaleString()}`, color: '#E50914' },
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Bienvenido al sistema de gestión de taller mecánico</p>
      </div>

      <div className="stats-grid">
        {statsCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ '--accent-color': stat.color }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="section">
        <h2 className="section-title">Órdenes Recientes</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Orden</th>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Empleado</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id_orden}>
                    <td><strong>ORD-{order.id_orden}</strong></td>
                    <td>{order.vehiculo?.cliente?.nombre || 'N/A'}</td>
                    <td>{`${order.vehiculo?.marca || ''} ${order.vehiculo?.modelo || ''}`}</td>
                    <td>{order.empleado?.nombre || 'Sin asignar'}</td>
                    <td>
                      <span className={`badge badge-${order.estado.replace('_', '-')}`}>
                        {order.estado}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    No hay órdenes recientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .dashboard { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .page-header { position: relative; background: linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(20, 20, 20, 0.9) 100%); padding: 60px 40px; border-radius: 16px; margin-bottom: 32px; overflow: hidden; }
        .page-header h1 { font-size: 48px; font-weight: 900; margin-bottom: 8px; }
        .page-header p { font-size: 18px; color: #999; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-bottom: 32px; }
        .stat-card { background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 20px; transition: all 0.3s; position: relative; overflow: hidden; }
        .stat-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--accent-color); }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(229, 9, 20, 0.2); border-color: var(--accent-color); }
        .stat-icon { width: 64px; height: 64px; background: rgba(229, 9, 20, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 32px; }
        .stat-content { flex: 1; }
        .stat-value { font-size: 32px; font-weight: 900; color: var(--accent-color); margin-bottom: 4px; }
        .stat-label { font-size: 14px; color: #999; }
        .section { background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 32px; margin-bottom: 24px; }
        .section-title { font-size: 24px; font-weight: 700; margin-bottom: 24px; color: #fff; }
        .table-container { overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table thead { background: rgba(229, 9, 20, 0.1); }
        .data-table th { padding: 16px; text-align: left; font-size: 13px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 1px; }
        .data-table td { padding: 16px; border-top: 1px solid #2a2a2a; font-size: 14px; }
        .data-table tbody tr { transition: all 0.2s; }
        .data-table tbody tr:hover { background: rgba(229, 9, 20, 0.05); }
        .badge { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .badge-en-proceso { background: rgba(255, 152, 0, 0.2); color: #FF9800; }
        .badge-completado { background: rgba(76, 175, 80, 0.2); color: #4CAF50; }
        .badge-pendiente { background: rgba(244, 67, 54, 0.2); color: #F44336; }
        .badge-entregado { background: rgba(33, 150, 243, 0.2); color: #2196F3; }
        @media (max-width: 768px) { .page-header { padding: 40px 24px; } .page-header h1 { font-size: 32px; } .stats-grid { grid-template-columns: 1fr; } .section { padding: 20px; } }
      `}</style>
    </div>
  );
}