import React, { useState, useEffect } from 'react';
import clientesService from '../services/clientesService';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    correo: ''
  });

  useEffect(() => {
    loadClientes();
  }, []);

  useEffect(() => {
    // Filtrar clientes cuando cambie el término de búsqueda
    if (searchTerm === '') {
      setClientesFiltrados(clientes);
    } else {
      const filtered = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.telefono.includes(searchTerm) ||
        (cliente.correo && cliente.correo.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setClientesFiltrados(filtered);
    }
  }, [searchTerm, clientes]);

  const loadClientes = async () => {
    try {
      const data = await clientesService.getAll();
      setClientes(data);
      setClientesFiltrados(data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
      alert('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCliente) {
        await clientesService.update(editingCliente.id_cliente, formData);
        alert('Cliente actualizado exitosamente');
      } else {
        await clientesService.create(formData);
        alert('Cliente creado exitosamente');
      }
      setShowModal(false);
      setFormData({ nombre: '', direccion: '', telefono: '', correo: '' });
      setEditingCliente(null);
      loadClientes();
    } catch (error) {
      console.error('Error guardando cliente:', error);
      alert('Error al guardar cliente');
    }
  };

  const handleEdit = (cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nombre: cliente.nombre,
      direccion: cliente.direccion || '',
      telefono: cliente.telefono,
      correo: cliente.correo || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) return;
    try {
      await clientesService.delete(id);
      alert('Cliente eliminado exitosamente');
      loadClientes();
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      alert(error.response?.data?.message || 'Error al eliminar cliente');
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando clientes...</div>;
  }

  return (
    <div className="clientes-container">
      <div className="page-header-small">
        <h1>👥 Clientes</h1>
        <button className="btn-primary" onClick={() => {
          setEditingCliente(null);
          setFormData({ nombre: '', direccion: '', telefono: '', correo: '' });
          setShowModal(true);
        }}>
          <span>+</span> Nuevo Cliente
        </button>
      </div>

      {/* 🔍 BARRA DE BÚSQUEDA */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre, teléfono o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              ✕
            </button>
          )}
        </div>
        <div className="search-results-count">
          {searchTerm && (
            <span>Mostrando {clientesFiltrados.length} de {clientes.length} clientes</span>
          )}
        </div>
      </div>

      <div className="content-box">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id_cliente}>
                    <td><strong>#{cliente.id_cliente}</strong></td>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.direccion || 'N/A'}</td>
                    <td>{cliente.telefono}</td>
                    <td>{cliente.correo || 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" onClick={() => handleEdit(cliente)} title="Editar">✏️</button>
                        <button className="btn-icon" onClick={() => handleDelete(cliente.id_cliente)} title="Eliminar">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    {searchTerm ? 'No se encontraron resultados' : 'No hay clientes registrados'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Teléfono *</label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Correo</label>
                <input
                  type="email"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingCliente ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .clientes-container { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .page-header-small { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .page-header-small h1 { font-size: 36px; font-weight: 900; }
        .btn-primary { background: linear-gradient(135deg, #E50914 0%, #b20710 100%); color: #fff; border: none; border-radius: 8px; padding: 12px 24px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.3s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(229, 9, 20, 0.4); }
        .btn-primary span { font-size: 20px; }
        
        /* 🔍 ESTILOS DE BÚSQUEDA */
        .search-bar { 
          background: #1a1a1a; 
          border: 1px solid #333; 
          border-radius: 16px; 
          padding: 20px; 
          margin-bottom: 24px;
        }
        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }
        .search-icon {
          position: absolute;
          left: 16px;
          font-size: 20px;
          color: #666;
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          background: #2a2a2a;
          border: 2px solid #333;
          border-radius: 12px;
          padding: 14px 48px 14px 48px;
          color: #fff;
          font-size: 15px;
          transition: all 0.3s;
        }
        .search-input:focus {
          outline: none;
          border-color: #E50914;
          background: #1a1a1a;
          box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.1);
        }
        .search-input::placeholder {
          color: #666;
        }
        .clear-search {
          position: absolute;
          right: 16px;
          background: rgba(229, 9, 20, 0.1);
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          color: #E50914;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: all 0.2s;
        }
        .clear-search:hover {
          background: #E50914;
          color: #fff;
          transform: scale(1.1);
        }
        .search-results-count {
          color: #999;
          font-size: 13px;
          text-align: center;
          padding: 4px;
        }
        
        .content-box { background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 32px; }
        .table-container { overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table thead { background: rgba(229, 9, 20, 0.1); }
        .data-table th { padding: 16px; text-align: left; font-size: 13px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 1px; }
        .data-table td { padding: 16px; border-top: 1px solid #2a2a2a; font-size: 14px; }
        .data-table tbody tr { transition: all 0.2s; }
        .data-table tbody tr:hover { background: rgba(229, 9, 20, 0.05); }
        .action-buttons { display: flex; gap: 8px; }
        .btn-icon { background: rgba(229, 9, 20, 0.1); border: 1px solid rgba(229, 9, 20, 0.3); border-radius: 6px; padding: 8px 12px; cursor: pointer; font-size: 16px; transition: all 0.2s; }
        .btn-icon:hover { background: #E50914; transform: scale(1.1); }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.3s ease; }
        .modal-content { background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 32px; width: 90%; max-width: 500px; animation: slideUp 0.3s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .modal-content h2 { margin-bottom: 24px; font-size: 24px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-size: 13px; color: #999; font-weight: 600; text-transform: uppercase; }
        .form-group input { width: 100%; background: #2a2a2a; border: 1px solid #333; border-radius: 8px; padding: 12px 16px; color: #fff; font-size: 15px; }
        .form-group input:focus { outline: none; border-color: #E50914; }
        .modal-actions { display: flex; gap: 12px; margin-top: 24px; }
        .btn-secondary { flex: 1; background: rgba(255, 255, 255, 0.1); border: 1px solid #333; border-radius: 8px; padding: 12px; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-secondary:hover { background: rgba(255, 255, 255, 0.15); }
        @media (max-width: 768px) { .page-header-small { flex-direction: column; align-items: flex-start; gap: 16px; } .content-box { padding: 20px; } }
      `}</style>
    </div>
  );
}