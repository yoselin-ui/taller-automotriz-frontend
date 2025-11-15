import React, { useState, useEffect } from 'react';
import facturasService from '../services/facturasService';

export default function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [facturasFiltradas, setFacturasFiltradas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroMetodoPago, setFiltroMetodoPago] = useState('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFacturas();
  }, []);

  useEffect(() => {
    // Filtrar facturas cuando cambie el término de búsqueda o filtro
    let filtered = facturas;

    // Filtrar por búsqueda
    if (searchTerm !== '') {
      filtered = filtered.filter(factura =>
        factura.id_factura.toString().includes(searchTerm) ||
        factura.id_orden.toString().includes(searchTerm) ||
        (factura.orden?.vehiculo?.cliente?.nombre && factura.orden.vehiculo.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        factura.total.toString().includes(searchTerm)
      );
    }

    // Filtrar por método de pago
    if (filtroMetodoPago !== 'todos') {
      filtered = filtered.filter(factura => factura.metodo_pago === filtroMetodoPago);
    }

    setFacturasFiltradas(filtered);
  }, [searchTerm, filtroMetodoPago, facturas]);

  const loadFacturas = async () => {
    try {
      const data = await facturasService.getAll();
      setFacturas(data);
      setFacturasFiltradas(data);
    } catch (error) {
      console.error('Error cargando facturas:', error);
      alert('Error al cargar facturas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando facturas...</div>;

  return (
    <div className="facturas-container">
      <div className="page-header-small">
        <h1>🧾 Facturas</h1>
      </div>

      {/* 🔍 BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por ID factura, ID orden, cliente o monto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>
        
        {/* Filtros de Método de Pago */}
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filtroMetodoPago === 'todos' ? 'active' : ''}`}
            onClick={() => setFiltroMetodoPago('todos')}
          >
            Todos
          </button>
          <button 
            className={`filter-btn ${filtroMetodoPago === 'efectivo' ? 'active' : ''}`}
            onClick={() => setFiltroMetodoPago('efectivo')}
          >
            💵 Efectivo
          </button>
          <button 
            className={`filter-btn ${filtroMetodoPago === 'tarjeta' ? 'active' : ''}`}
            onClick={() => setFiltroMetodoPago('tarjeta')}
          >
            💳 Tarjeta
          </button>
          <button 
            className={`filter-btn ${filtroMetodoPago === 'transferencia' ? 'active' : ''}`}
            onClick={() => setFiltroMetodoPago('transferencia')}
          >
            🏦 Transferencia
          </button>
        </div>

        {(searchTerm || filtroMetodoPago !== 'todos') && (
          <div className="search-results-count">
            <span>Mostrando {facturasFiltradas.length} de {facturas.length} facturas</span>
          </div>
        )}
      </div>

      <div className="content-box">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Factura</th>
                <th>ID Orden</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Subtotal</th>
                <th>IVA</th>
                <th>Total</th>
                <th>Método Pago</th>
              </tr>
            </thead>
            <tbody>
              {facturasFiltradas.length > 0 ? (
                facturasFiltradas.map((factura) => (
                  <tr key={factura.id_factura}>
                    <td><strong>FAC-{factura.id_factura}</strong></td>
                    <td><span className="badge-orden">ORD-{factura.id_orden}</span></td>
                    <td>{new Date(factura.fecha).toLocaleDateString()}</td>
                    <td>{factura.orden?.vehiculo?.cliente?.nombre || 'N/A'}</td>
                    <td>${parseFloat(factura.subtotal).toFixed(2)}</td>
                    <td>${parseFloat(factura.iva).toFixed(2)}</td>
                    <td className="total-amount">${parseFloat(factura.total).toFixed(2)}</td>
                    <td>
                      <span className={`metodo-pago metodo-${factura.metodo_pago || 'efectivo'}`}>
                        {factura.metodo_pago === 'efectivo' && '💵'}
                        {factura.metodo_pago === 'tarjeta' && '💳'}
                        {factura.metodo_pago === 'transferencia' && '🏦'}
                        {' '}
                        {(factura.metodo_pago || 'efectivo').charAt(0).toUpperCase() + (factura.metodo_pago || 'efectivo').slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    {searchTerm || filtroMetodoPago !== 'todos' ? 'No se encontraron resultados' : 'No hay facturas registradas'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {facturasFiltradas.length > 0 && (
          <div className="totals-summary">
            <div className="summary-card">
              <div className="summary-label">Total Facturas</div>
              <div className="summary-value">{facturasFiltradas.length}</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Subtotal</div>
              <div className="summary-value">
                ${facturasFiltradas.reduce((sum, f) => sum + parseFloat(f.subtotal), 0).toFixed(2)}
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-label">IVA Total</div>
              <div className="summary-value">
                ${facturasFiltradas.reduce((sum, f) => sum + parseFloat(f.iva), 0).toFixed(2)}
              </div>
            </div>
            <div className="summary-card highlight">
              <div className="summary-label">Monto Total</div>
              <div className="summary-value total">
                ${facturasFiltradas.reduce((sum, f) => sum + parseFloat(f.total), 0).toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .facturas-container { animation: fadeIn 0.5s ease; }
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
        .table-container { overflow-x: auto; margin-bottom: 24px; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table thead { background: rgba(229, 9, 20, 0.1); }
        .data-table th { padding: 16px; text-align: left; font-size: 13px; font-weight: 700; color: #999; text-transform: uppercase; }
        .data-table td { padding: 16px; border-top: 1px solid #2a2a2a; font-size: 14px; }
        .data-table tbody tr:hover { background: rgba(229, 9, 20, 0.05); }
        
        .badge-orden { background: rgba(255, 152, 0, 0.2); color: #FF9800; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-family: monospace; font-size: 12px; }
        .total-amount { font-weight: 700; color: #4CAF50; font-size: 16px; }
        .metodo-pago { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .metodo-efectivo { background: rgba(76, 175, 80, 0.2); color: #4CAF50; }
        .metodo-tarjeta { background: rgba(33, 150, 243, 0.2); color: #2196F3; }
        .metodo-transferencia { background: rgba(156, 39, 176, 0.2); color: #9C27B0; }
        
        .totals-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 24px; }
        .summary-card { background: rgba(229, 9, 20, 0.1); border: 1px solid rgba(229, 9, 20, 0.3); border-radius: 12px; padding: 20px; text-align: center; transition: all 0.3s; }
        .summary-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(229, 9, 20, 0.2); }
        .summary-card.highlight { background: linear-gradient(135deg, rgba(229, 9, 20, 0.2) 0%, rgba(178, 7, 16, 0.2) 100%); border-color: #E50914; }
        .summary-label { font-size: 13px; color: #999; text-transform: uppercase; font-weight: 600; margin-bottom: 8px; }
        .summary-value { font-size: 28px; font-weight: 900; color: #fff; }
        .summary-value.total { color: #4CAF50; font-size: 32px; }
      `}</style>
    </div>
  );
}