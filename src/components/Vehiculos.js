import React, { useState, useEffect } from 'react';
import vehiculosService from '../services/vehiculosService';
import clientesService from '../services/clientesService';

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState(null);
  const [formData, setFormData] = useState({
    id_cliente: '',
    marca: '',
    modelo: '',
    anio: '',
    placas: '',
    color: '',
    vin: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Filtrar vehículos cuando cambie el término de búsqueda
    if (searchTerm === '') {
      setVehiculosFiltrados(vehiculos);
    } else {
      const filtered = vehiculos.filter(vehiculo =>
        vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehiculo.placas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vehiculo.cliente?.nombre && vehiculo.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (vehiculo.color && vehiculo.color.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setVehiculosFiltrados(filtered);
    }
  }, [searchTerm, vehiculos]);

  const loadData = async () => {
    try {
      const [vehiculosData, clientesData] = await Promise.all([
        vehiculosService.getAll(),
        clientesService.getAll()
      ]);
      setVehiculos(vehiculosData);
      setVehiculosFiltrados(vehiculosData);
      setClientes(clientesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVehiculo) {
        await vehiculosService.update(editingVehiculo.id_vehiculo, formData);
        alert('Vehículo actualizado exitosamente');
      } else {
        await vehiculosService.create(formData);
        alert('Vehículo creado exitosamente');
      }
      setShowModal(false);
      setFormData({ id_cliente: '', marca: '', modelo: '', anio: '', placas: '', color: '', vin: '' });
      setEditingVehiculo(null);
      loadData();
    } catch (error) {
      console.error('Error guardando vehículo:', error);
      alert(error.response?.data?.message || 'Error al guardar vehículo');
    }
  };

  const handleEdit = (vehiculo) => {
    setEditingVehiculo(vehiculo);
    setFormData({
      id_cliente: vehiculo.id_cliente,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      anio: vehiculo.anio,
      placas: vehiculo.placas,
      color: vehiculo.color || '',
      vin: vehiculo.vin || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este vehículo?')) return;
    try {
      await vehiculosService.delete(id);
      alert('Vehículo eliminado exitosamente');
      loadData();
    } catch (error) {
      console.error('Error eliminando vehículo:', error);
      alert(error.response?.data?.message || 'Error al eliminar vehículo');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando vehículos...</div>;

  return (
    <div className="vehiculos-container">
      <div className="page-header-small">
        <h1>🚗 Vehículos</h1>
        <button className="btn-primary" onClick={() => {
          setEditingVehiculo(null);
          setFormData({ id_cliente: '', marca: '', modelo: '', anio: '', placas: '', color: '', vin: '' });
          setShowModal(true);
        }}>
          <span>+</span> Registrar Vehículo
        </button>
      </div>

      {/* 🔍 BARRA DE BÚSQUEDA */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por marca, modelo, placas, cliente o color..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>
        {searchTerm && (
          <div className="search-results-count">
            <span>Mostrando {vehiculosFiltrados.length} de {vehiculos.length} vehículos</span>
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
                <th>Marca</th>
                <th>Modelo</th>
                <th>Año</th>
                <th>Placas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehiculosFiltrados.length > 0 ? (
                vehiculosFiltrados.map((vehiculo) => (
                  <tr key={vehiculo.id_vehiculo}>
                    <td><strong>#{vehiculo.id_vehiculo}</strong></td>
                    <td>{vehiculo.cliente?.nombre || 'N/A'}</td>
                    <td>{vehiculo.marca}</td>
                    <td>{vehiculo.modelo}</td>
                    <td>{vehiculo.anio}</td>
                    <td><span className="badge-plate">{vehiculo.placas}</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" onClick={() => handleEdit(vehiculo)} title="Editar">✏️</button>
                        <button className="btn-icon" onClick={() => handleDelete(vehiculo.id_vehiculo)} title="Eliminar">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    {searchTerm ? 'No se encontraron resultados' : 'No hay vehículos registrados'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()}>
            <h2>{editingVehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Cliente *</label>
                <select value={formData.id_cliente} onChange={(e) => setFormData({ ...formData, id_cliente: e.target.value })} required>
                  <option value="">Selecciona un cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id_cliente} value={cliente.id_cliente}>{cliente.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Marca *</label>
                  <input type="text" value={formData.marca} onChange={(e) => setFormData({ ...formData, marca: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Modelo *</label>
                  <input type="text" value={formData.modelo} onChange={(e) => setFormData({ ...formData, modelo: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Año *</label>
                  <input type="number" value={formData.anio} onChange={(e) => setFormData({ ...formData, anio: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Placas *</label>
                  <input type="text" value={formData.placas} onChange={(e) => setFormData({ ...formData, placas: e.target.value.toUpperCase() })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Color</label>
                  <input type="text" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>VIN</label>
                  <input type="text" value={formData.vin} onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })} maxLength="17" />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">{editingVehiculo ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .vehiculos-container { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .page-header-small { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .page-header-small h1 { font-size: 36px; font-weight: 900; }
        .btn-primary { background: linear-gradient(135deg, #E50914 0%, #b20710 100%); color: #fff; border: none; border-radius: 8px; padding: 12px 24px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.3s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(229, 9, 20, 0.4); }
        
        /* 🔍 BÚSQUEDA */
        .search-bar { background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 20px; margin-bottom: 24px; }
        .search-input-wrapper { position: relative; display: flex; align-items: center; margin-bottom: 12px; }
        .search-icon { position: absolute; left: 16px; font-size: 20px; color: #666; pointer-events: none; }
        .search-input { width: 100%; background: #2a2a2a; border: 2px solid #333; border-radius: 12px; padding: 14px 48px; color: #fff; font-size: 15px; transition: all 0.3s; }
        .search-input:focus { outline: none; border-color: #E50914; background: #1a1a1a; box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.1); }
        .search-input::placeholder { color: #666; }
        .clear-search { position: absolute; right: 16px; background: rgba(229, 9, 20, 0.1); border: none; border-radius: 50%; width: 28px; height: 28px; color: #E50914; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: all 0.2s; }
        .clear-search:hover { background: #E50914; color: #fff; transform: scale(1.1); }
        .search-results-count { color: #999; font-size: 13px; text-align: center; padding: 4px; }
        
        .content-box { background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 32px; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table thead { background: rgba(229, 9, 20, 0.1); }
        .data-table th { padding: 16px; text-align: left; font-size: 13px; font-weight: 700; color: #999; text-transform: uppercase; }
        .data-table td { padding: 16px; border-top: 1px solid #2a2a2a; font-size: 14px; }
        .data-table tbody tr:hover { background: rgba(229, 9, 20, 0.05); }
        .badge-plate { background: rgba(33, 150, 243, 0.2); color: #2196F3; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-family: monospace; }
        .action-buttons { display: flex; gap: 8px; }
        .btn-icon { background: rgba(229, 9, 20, 0.1); border: 1px solid rgba(229, 9, 20, 0.3); border-radius: 6px; padding: 8px 12px; cursor: pointer; font-size: 16px; transition: all 0.2s; }
        .btn-icon:hover { background: #E50914; transform: scale(1.1); }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.3s ease; padding: 20px; }
        .modal-content-large { background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 32px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; animation: slideUp 0.3s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .modal-content-large h2 { margin-bottom: 24px; font-size: 24px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-size: 13px; color: #999; font-weight: 600; text-transform: uppercase; }
        .form-group input, .form-group select { width: 100%; background: #2a2a2a; border: 1px solid #333; border-radius: 8px; padding: 12px 16px; color: #fff; font-size: 15px; font-family: inherit; }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: #E50914; }
        .modal-actions { display: flex; gap: 12px; margin-top: 24px; }
        .btn-secondary { flex: 1; background: rgba(255, 255, 255, 0.1); border: 1px solid #333; border-radius: 8px; padding: 12px; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-secondary:hover { background: rgba(255, 255, 255, 0.15); }
      `}</style>
    </div>
  );
}