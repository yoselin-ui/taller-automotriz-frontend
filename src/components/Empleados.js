import React, { useState, useEffect } from "react";
import empleadosService from "../services/empleadosService";

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    especialidad: "",
    telefono: "",
    salario: "",
  });

  useEffect(() => {
    loadEmpleados();
  }, []);

  useEffect(() => {
    // Filtrar empleados cuando cambie el término de búsqueda
    if (searchTerm === "") {
      setEmpleadosFiltrados(empleados);
    } else {
      const filtered = empleados.filter(
        (empleado) =>
          empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (empleado.especialidad &&
            empleado.especialidad
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (empleado.telefono && empleado.telefono.includes(searchTerm))
      );
      setEmpleadosFiltrados(filtered);
    }
  }, [searchTerm, empleados]);

  const loadEmpleados = async () => {
    try {
      const data = await empleadosService.getAll();
      setEmpleados(data);
      setEmpleadosFiltrados(data);
    } catch (error) {
      console.error("Error cargando empleados:", error);
      alert("Error al cargar empleados");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmpleado) {
        await empleadosService.update(editingEmpleado.id_empleado, formData);
        alert("Empleado actualizado exitosamente");
      } else {
        await empleadosService.create(formData);
        alert("Empleado creado exitosamente");
      }
      setShowModal(false);
      setFormData({ nombre: "", especialidad: "", telefono: "", salario: "" });
      setEditingEmpleado(null);
      loadEmpleados();
    } catch (error) {
      console.error("Error guardando empleado:", error);
      alert(error.response?.data?.message || "Error al guardar empleado");
    }
  };

  const handleEdit = (empleado) => {
    setEditingEmpleado(empleado);
    setFormData({
      nombre: empleado.nombre,
      especialidad: empleado.especialidad || "",
      telefono: empleado.telefono || "",
      salario: empleado.salario || "",
    });
    setShowModal(true);
  };

  const handleToggle = async (id) => {
    try {
      await empleadosService.toggle(id);
      loadEmpleados();
    } catch (error) {
      console.error("Error cambiando estado:", error);
      alert("Error al cambiar estado del empleado");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este empleado?")) return;
    try {
      await empleadosService.delete(id);
      alert("Empleado eliminado exitosamente");
      loadEmpleados();
    } catch (error) {
      console.error("Error eliminando empleado:", error);
      alert(error.response?.data?.message || "Error al eliminar empleado");
    }
  };

  if (loading)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Cargando empleados...
      </div>
    );

  return (
    <div className="empleados-container">
      <div className="page-header-small">
        <h1>👨‍🔧 Empleados</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingEmpleado(null);
            setFormData({
              nombre: "",
              especialidad: "",
              telefono: "",
              salario: "",
            });
            setShowModal(true);
          }}
        >
          <span>+</span> Nuevo Empleado
        </button>
      </div>

      {/* 🔍 BARRA DE BÚSQUEDA */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre, especialidad o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>
        {searchTerm && (
          <div className="search-results-count">
            <span>
              Mostrando {empleadosFiltrados.length} de {empleados.length}{" "}
              empleados
            </span>
          </div>
        )}
      </div>

      <div className="employees-grid">
        {empleadosFiltrados.length > 0 ? (
          empleadosFiltrados.map((empleado) => (
            <div
              key={empleado.id_empleado}
              className={`employee-card ${!empleado.activo ? "inactive" : ""}`}
            >
              <div className="employee-avatar">👨‍🔧</div>
              <h3>{empleado.nombre}</h3>
              {empleado.especialidad && (
                <div className="employee-specialty">
                  {empleado.especialidad}
                </div>
              )}
              {empleado.telefono && (
                <div className="employee-contact">
                  <span>📞</span> {empleado.telefono}
                </div>
              )}
              {empleado.salario && (
                <div className="employee-salary">
                  💰 Q{parseFloat(empleado.salario).toLocaleString()}
                </div>
              )}
              <div className="employee-status">
                {empleado.activo ? (
                  <span className="badge-active">Activo</span>
                ) : (
                  <span className="badge-inactive">Inactivo</span>
                )}
              </div>
              <div className="employee-actions">
                <button
                  className="btn-icon"
                  onClick={() => handleEdit(empleado)}
                >
                  ✏️
                </button>
                <button
                  className="btn-icon"
                  onClick={() => handleToggle(empleado.id_empleado)}
                >
                  {empleado.activo ? "🔒" : "✅"}
                </button>
                <button
                  className="btn-icon"
                  onClick={() => handleDelete(empleado.id_empleado)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px",
              color: "#666",
            }}
          >
            {searchTerm
              ? "No se encontraron resultados"
              : "No hay empleados registrados"}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingEmpleado ? "Editar Empleado" : "Nuevo Empleado"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Especialidad</label>
                <input
                  type="text"
                  value={formData.especialidad}
                  onChange={(e) =>
                    setFormData({ ...formData, especialidad: e.target.value })
                  }
                  placeholder="Ej: Mecánico General"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Salario</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salario}
                    onChange={(e) =>
                      setFormData({ ...formData, salario: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingEmpleado ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .empleados-container {
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

        /* 🔍 BÚSQUEDA */
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
          padding: 14px 48px;
          color: #fff;
          font-size: 15px;
          transition: all 0.3s;
        }
        .search-input:focus {
          outline: none;
          border-color: #e50914;
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
          color: #e50914;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: all 0.2s;
        }
        .clear-search:hover {
          background: #e50914;
          color: #fff;
          transform: scale(1.1);
        }
        .search-results-count {
          color: #999;
          font-size: 13px;
          text-align: center;
          padding: 4px;
        }

        .employees-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .employee-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          transition: all 0.3s;
        }
        .employee-card.inactive {
          opacity: 0.6;
          border-color: #555;
        }
        .employee-card:hover {
          transform: translateY(-4px);
          border-color: #e50914;
          box-shadow: 0 8px 32px rgba(229, 9, 20, 0.2);
        }
        .employee-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          margin: 0 auto 20px;
        }
        .employee-card h3 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .employee-specialty {
          background: rgba(229, 9, 20, 0.2);
          color: #e50914;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 12px;
        }
        .employee-contact {
          color: #999;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .employee-salary {
          color: #4caf50;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .employee-status {
          margin-bottom: 16px;
        }
        .badge-active {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .badge-inactive {
          background: rgba(244, 67, 54, 0.2);
          color: #f44336;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .employee-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
        }
        .btn-icon {
          background: rgba(229, 9, 20, 0.1);
          border: 1px solid rgba(229, 9, 20, 0.3);
          border-radius: 8px;
          padding: 10px 16px;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.2s;
        }
        .btn-icon:hover {
          background: #e50914;
          transform: scale(1.1);
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease;
        }
        .modal-content {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 32px;
          width: 90%;
          max-width: 500px;
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .modal-content h2 {
          margin-bottom: 24px;
          font-size: 24px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          color: #999;
          font-weight: 600;
          text-transform: uppercase;
        }
        .form-group input {
          width: 100%;
          background: #2a2a2a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 12px 16px;
          color: #fff;
          font-size: 15px;
        }
        .form-group input:focus {
          outline: none;
          border-color: #e50914;
        }
        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        .btn-secondary {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid #333;
          border-radius: 8px;
          padding: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </div>
  );
}
