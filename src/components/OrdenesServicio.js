import React, { useState, useEffect } from 'react';
import ordenesService from '../services/ordenesService';

export default function OrdenesServicio() {
  const [ordenes, setOrdenes] = useState([]);
  const [ordenesFiltradas, setOrdenesFiltradas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrdenes();
  }, []);

  useEffect(() => {
    // Filtrar órdenes cuando cambie el término de búsqueda o filtro de estado
    let filtered = ordenes;

    // Filtrar por búsqueda
    if (searchTerm !== '') {
      filtered = filtered.filter(orden =>
        (orden.vehiculo?.cliente?.nombre && orden.vehiculo.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (orden.vehiculo?.placas && orden.vehiculo.placas.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (orden.vehiculo?.marca && orden.vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (orden.vehiculo?.modelo && orden.vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (orden.empleado?.nombre && orden.empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        orden.id_orden.toString().includes(searchTerm)
      );
    }

    // Filtrar por estado
    if (filtroEstado !== 'todos') {
      filtered = filtered.filter(orden => orden.estado === filtroEstado);
    }

    setOrdenesFiltradas(filtered);
  }, [searchTerm, filtroEstado, ordenes]);

  const loadOrdenes = async () => {
    try {
      const data = await ordenesService.getAll();
      setOrdenes(data);
      setOrdenesFiltradas(data);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      alert('Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEstado = async (idOrden, nuevoEstado) => {
    try {
      await ordenesService.update(idOrden, { estado: nuevoEstado });
      alert('Estado actualizado');
      loadOrdenes();
    } catch (error) {
      console.error('Error actualizando estado:', error);
      alert('Error al actualizar estado');
    }
  };

  const getEstadoBadgeClass = (estado) => {
    const classes = {
      'pendiente': 'badge-pendiente',
      'en_proceso': 'badge-en-proceso',
      'completado': 'badge-completado',
      'entregado': 'badge-entregado'
    };
    return classes[estado] || 'badge-pendiente';
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      'pendiente': 'Pendiente',
      'en_proceso': 'En Proceso',
      'completado': 'Completado',
      'entregado': 'Entregado'
    };
    return labels[estado] || estado;
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando órdenes...</div>;

  return (
    <div className="ordenes-container">
      <div className="page-header-small">
        <h1>📋 Órdenes de Servicio</h1>
      </div>

      {/* 🔍 BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por ID, cliente, placas, vehículo o mecánico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>
        
        {/* Filtros de Estado */}
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filtroEstado === 'todos' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('todos')}
          >
            Todos
          </button>
          <button 
            className={`filter-btn ${filtroEstado === 'pendiente' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('pendiente')}
          >
            Pendientes
          </button>
          <button 
            className={`filter-btn ${filtroEstado === 'en_proceso' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('en_proceso')}
          >
            En Proceso
          </button>
          <button 
            className={`filter-btn ${filtroEstado === 'completado' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('completado')}
          >
            Completados
          </button>
          <button 
            className={`filter-btn ${filtroEstado === 'entregado' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('entregado')}
          >
            Entregados
          </button>
        </div>

        {(searchTerm || filtroEstado !== 'todos') && (
          <div className="search-results-count">
            <span>Mostrando {ordenesFiltradas.length} de {ordenes.length} órdenes</span>
          </div>
        )}
      </div>

      <div className="content-box">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Placas</th>
                <th>Mecánico</th>
                <th>Fecha Entrada</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenesFiltradas.length > 0 ? (
                ordenesFiltradas.map((orden) => (
                  <tr key={orden.id_orden}>
                    <td><strong>ORD-{orden.id_orden}</strong></td>
                    <td>{orden.vehiculo?.cliente?.nombre || 'N/A'}</td>
                    <td>{`${orden.vehiculo?.marca || ''} ${orden.vehiculo?.modelo || ''}`}</td>
                    <td><span className="badge-plate">{orden.vehiculo?.placas || 'N/A'}</span></td>
                    <td>{orden.empleado?.nombre || 'Sin asignar'}</td>
                    <td>{new Date(orden.fecha_entrada).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${getEstadoBadgeClass(orden.estado)}`}>
                        {getEstadoLabel(orden.estado)}
                      </span>
                    </td>
                    <td>
                      <select
                        value={orden.estado}
                        onChange={(e) => handleUpdateEstado(orden.id_orden, e.target.value)}
                        className="estado-select"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_proceso">En Proceso</option>
                        <option value="completado">Completado</option>
                        <option value="entregado">Entregado</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    {searchTerm || filtroEstado !== 'todos' ? 'No se encontraron resultados' : 'No hay órdenes registradas'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .ordenes-container { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .page-header-small { margin-bottom: 32px; }
        .page-header-small h1 { font-size: 36px; font-weight: 900; }
        
        /* 🔍 BÚSQUEDA Y FILTROS */
        .search-bar { background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 20px; margin-bottom: 24px; }
        .search-input-wrapper { position: relative; display: flex; align-items: center; margin-bottom: 16px; }
        .search-icon { position: absolute; left: 16px; font-size: 20px; color: #666; pointer-events: none; }
        .search-input { width: 100%; background: #2a2a2a; border: 2px solid #333; border-radius: 12px; padding: 14px 48px; color: #fff; font-size: 15px; transition: all 0.3s; }
        .search-input:focus { outline: none; border-color: #E50914; background: #1a1a1a; box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.1); }
        .search-input::placeholder { color: #666; }
        .clear-search { position: absolute; right: 16px; background: rgba(229, 9, 20, 0.1); border: none; border-radius: 50%; width: 28px; height: 28px; color: #E50914; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: all 0.2s; }
        .clear-search:hover { background: #E50914; color: #fff; transform: scale(1.1); }
        
        .filter-buttons { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
        .filter-btn { background: #2a2a2a; border: 1px solid #333; border-radius: 8px; padding: 10px 20px; color: #999; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .filter-btn:hover { background: rgba(229, 9, 20, 0.1); color: #E50914; border-color: #E50914; }
        .filter-btn.active { background: linear-gradient(135deg, #E50914 0%, #b20710 100%); color: #fff; border-color: #E50914; }
        .search-results-count { color: #999; font-size: 13px; text-align: center; padding: 4px; }
        
        .content-box { background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 32px; }
        .table-container { overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table thead { background: rgba(229, 9, 20, 0.1); }
        .data-table th { padding: 16px; text-align: left; font-size: 13px; font-weight: 700; color: #999; text-transform: uppercase; }
        .data-table td { padding: 16px; border-top: 1px solid #2a2a2a; font-size: 14px; }
        .data-table tbody tr:hover { background: rgba(229, 9, 20, 0.05); }
        
        .badge { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .badge-pendiente { background: rgba(244, 67, 54, 0.2); color: #F44336; }
        .badge-en-proceso { background: rgba(255, 152, 0, 0.2); color: #FF9800; }
        .badge-completado { background: rgba(76, 175, 80, 0.2); color: #4CAF50; }
        .badge-entregado { background: rgba(33, 150, 243, 0.2); color: #2196F3; }
        .badge-plate { background: rgba(33, 150, 243, 0.2); color: #2196F3; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-family: monospace; }
        
        .estado-select { background: #2a2a2a; border: 1px solid #333; border-radius: 6px; padding: 8px 12px; color: #fff; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .estado-select:hover { border-color: #E50914; }
        .estado-select:focus { outline: none; border-color: #E50914; }
      `}</style>
    </div>
  );
}