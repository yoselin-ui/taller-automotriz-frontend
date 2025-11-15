import React, { useState, useEffect } from 'react';
import serviciosService from '../services/serviciosService';

export default function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [serviciosFiltrados, setServiciosFiltrados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingServicio, setEditingServicio] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    tiempo_est: ''
  });

  useEffect(() => {
    loadServicios();
  }, []);

  useEffect(() => {
    // Filtrar servicios cuando cambie el término de búsqueda
    if (searchTerm === '') {
      setServiciosFiltrados(servicios);
    } else {
      const filtered = servicios.filter(servicio =>
        servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (servicio.descripcion && servicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        servicio.precio.toString().includes(searchTerm)
      );
      setServiciosFiltrados(filtered);
    }
  }, [searchTerm, servicios]);

  const loadServicios = async () => {
    try {
      const data = await serviciosService.getAll();
      setServicios(data);
      setServiciosFiltrados(data);
    } catch (error) {
      console.error('Error cargando servicios:', error);
      alert('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingServicio) {
        await serviciosService.update(editingServicio.id_servicio, formData);
        alert('Servicio actualizado exitosamente');
      } else {
        await serviciosService.create(formData);
        alert('Servicio creado exitosamente');
      }
      setShowModal(false);
      setFormData({ nombre: '', descripcion: '', precio: '', tiempo_est: '' });
      setEditingServicio(null);
      loadServicios();
    } catch (error) {
      console.error('Error guardando servicio:', error);
      alert(error.response?.data?.message || 'Error al guardar servicio');
    }
  };

  const handleEdit = (servicio) => {
    setEditingServicio(servicio);
    setFormData({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion || '',
      precio: servicio.precio,
      tiempo_est: servicio.tiempo_est || ''
    });
    setShowModal(true);
  };

  const handleToggle = async (id) => {
    try {
      await serviciosService.toggle(id);
      loadServicios();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error al cambiar estado del servicio');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este servicio?')) return;
    try {
      await serviciosService.delete(id);
      alert('Servicio eliminado exitosamente');
      loadServicios();
    } catch (error) {
      console.error('Error eliminando servicio:', error);
      alert(error.response?.data?.message || 'Error al eliminar servicio');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando servicios...</div>;

  return (
    <div className="servicios-container">
      <div className="page-header-small">
        <h1>🔧 Servicios</h1>
        <button className="btn-primary" onClick={() => {
          setEditingServicio(null);
          setFormData({ nombre: '', descripcion: '', precio: '', tiempo_est: '' });
          setShowModal(true);
        }}>
          <span>+</span> Nuevo Servicio
        </button>
      </div>

      {/* 🔍 BARRA DE BÚSQUEDA */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre, descripción o precio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>
        {searchTerm && (
          <div className="search-results-count">
            <span>Mostrando {serviciosFiltrados.length} de {servicios.length} servicios</span>
          </div>
        )}
      </div>

      <div className="services-grid">
        {serviciosFiltrados.length > 0 ? (
          serviciosFiltrados.map((servicio) => (
            <div key={servicio.id_servicio} className={`service-card ${!servicio.activo ? 'inactive' : ''}`}>
              <div className="service-icon">🔧</div>
              <h3>{servicio.nombre}</h3>
              <p>{servicio.descripcion || 'Sin descripción'}</p>
              <div className="service-price">${parseFloat(servicio.precio).toFixed(2)}</div>
              {servicio.tiempo_est && (
                <div className="service-time">⏱️ {servicio.tiempo_est} min</div>
              )}
              <div className="service-status">
                {servicio.activo ? (
                  <span className="badge-active">Activo</span>
                ) : (
                  <span className="badge-inactive">Inactivo</span>
                )}
              </div>
              <div className="service-actions">
                <button className="btn-edit" onClick={() => handleEdit(servicio)}>✏️ Editar</button>
                <button className={servicio.activo ? "btn-deactivate" : "btn-activate"} onClick={() => handleToggle(servicio.id_servicio)}>
                  {servicio.activo ? '🔒' : '✅'}
                </button>
                <button className="btn-delete" onClick={() => handleDelete(servicio.id_servicio)}>🗑️</button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
            {searchTerm ? 'No se encontraron resultados' : 'No hay servicios registrados'}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingServicio ? 'Editar Servicio' : 'Nuevo Servicio'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre *</label>
                <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} rows="3" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Precio *</label>
                  <input type="number" step="0.01" value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Tiempo (min)</label>
                  <input type="number" value={formData.tiempo_est} onChange={(e) => setFormData({ ...formData, tiempo_est: e.target.value })} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">{editingServicio ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .servicios-container { animation: fadeIn 0.5s ease; }
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
        
        .services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
        .service-card { background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 32px; transition: all 0.3s; position: relative; }
        .service-card.inactive { opacity: 0.6; border-color: #555; }
        .service-card:hover { transform: translateY(-4px); border-color: #E50914; box-shadow: 0 8px 32px rgba(229, 9, 20, 0.2); }
        .service-icon { width: 64px; height: 64px; background: rgba(229, 9, 20, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 20px; }
        .service-card h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
        .service-card p { color: #999; font-size: 14px; margin-bottom: 16px; min-height: 40px; }
        .service-price { font-size: 32px; font-weight: 900; color: #E50914; margin-bottom: 8px; }
        .service-time { color: #999; font-size: 13px; margin-bottom: 12px; }
        .service-status { margin-bottom: 16px; }
        .badge-active { background: rgba(76, 175, 80, 0.2); color: #4CAF50; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge-inactive { background: rgba(244, 67, 54, 0.2); color: #F44336; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .service-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .btn-edit, .btn-activate, .btn-deactivate, .btn-delete { flex: 1; min-width: 80px; padding: 10px; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-edit { background: rgba(33, 150, 243, 0.2); color: #2196F3; }
        .btn-edit:hover { background: #2196F3; color: #fff; }
        .btn-activate { background: rgba(76, 175, 80, 0.2); color: #4CAF50; }
        .btn-activate:hover { background: #4CAF50; color: #fff; }
        .btn-deactivate { background: rgba(255, 152, 0, 0.2); color: #FF9800; }
        .btn-deactivate:hover { background: #FF9800; color: #fff; }
        .btn-delete { background: rgba(244, 67, 54, 0.2); color: #F44336; flex: 0 0 40px; }
        .btn-delete:hover { background: #F44336; color: #fff; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.3s ease; }
        .modal-content { background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 32px; width: 90%; max-width: 500px; animation: slideUp 0.3s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .modal-content h2 { margin-bottom: 24px; font-size: 24px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-size: 13px; color: #999; font-weight: 600; text-transform: uppercase; }
        .form-group input, .form-group textarea { width: 100%; background: #2a2a2a; border: 1px solid #333; border-radius: 8px; padding: 12px 16px; color: #fff; font-size: 15px; font-family: inherit; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #E50914; }
        .modal-actions { display: flex; gap: 12px; margin-top: 24px; }
        .btn-secondary { flex: 1; background: rgba(255, 255, 255, 0.1); border: 1px solid #333; border-radius: 8px; padding: 12px; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-secondary:hover { background: rgba(255, 255, 255, 0.15); }
      `}</style>
    </div>
  );
}