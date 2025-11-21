import React, { useState, useEffect } from "react";
import ordenesService from "../services/ordenesService";
import vehiculosService from "../services/vehiculosService";
import empleadosService from "../services/empleadosService";
import serviciosService from "../services/serviciosService";

export default function OrdenesServicio() {
  const [ordenes, setOrdenes] = useState([]);
  const [ordenesFiltradas, setOrdenesFiltradas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [loading, setLoading] = useState(true);

  // ✅ NUEVOS ESTADOS PARA EL MODAL
  const [showModal, setShowModal] = useState(false);
  const [vehiculos, setVehiculos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [formData, setFormData] = useState({
    id_vehiculo: "",
    id_empleado: "",
    observaciones: "",
    kilometraje: "",
    servicios: [{ id_servicio: "", cantidad: 1 }],
  });

  useEffect(() => {
    loadOrdenes();
    loadFormData(); // ✅ CARGAR DATOS PARA FORMULARIO
  }, []);

  useEffect(() => {
    // Filtrar órdenes cuando cambie el término de búsqueda o filtro de estado
    let filtered = ordenes;

    // Filtrar por búsqueda
    if (searchTerm !== "") {
      filtered = filtered.filter(
        (orden) =>
          (orden.vehiculo?.cliente?.nombre &&
            orden.vehiculo.cliente.nombre
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (orden.vehiculo?.placas &&
            orden.vehiculo.placas
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (orden.vehiculo?.marca &&
            orden.vehiculo.marca
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (orden.vehiculo?.modelo &&
            orden.vehiculo.modelo
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (orden.empleado?.nombre &&
            orden.empleado.nombre
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          orden.id_orden.toString().includes(searchTerm)
      );
    }

    // Filtrar por estado
    if (filtroEstado !== "todos") {
      filtered = filtered.filter((orden) => orden.estado === filtroEstado);
    }

    setOrdenesFiltradas(filtered);
  }, [searchTerm, filtroEstado, ordenes]);

  const loadOrdenes = async () => {
    try {
      const data = await ordenesService.getAll();
      setOrdenes(data);
      setOrdenesFiltradas(data);
    } catch (error) {
      console.error("Error cargando órdenes:", error);
      alert("Error al cargar órdenes");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NUEVA FUNCIÓN: CARGAR DATOS PARA FORMULARIO
  const loadFormData = async () => {
    try {
      const [vehiculosData, empleadosData, serviciosData] = await Promise.all([
        vehiculosService.getAll(),
        empleadosService.getAll(true), // Solo activos
        serviciosService.getAll(true), // Solo activos
      ]);
      setVehiculos(vehiculosData);
      setEmpleados(empleadosData);
      setServiciosDisponibles(serviciosData);
    } catch (error) {
      console.error("Error cargando datos del formulario:", error);
    }
  };

  // ✅ NUEVA FUNCIÓN: CREAR ORDEN
  const handleCreateOrden = async (e) => {
    e.preventDefault();

    // Validar que al menos haya un servicio
    if (formData.servicios.length === 0 || !formData.servicios[0].id_servicio) {
      alert("Debes agregar al menos un servicio");
      return;
    }

    try {
      await ordenesService.create({
        id_vehiculo: parseInt(formData.id_vehiculo),
        id_empleado: formData.id_empleado
          ? parseInt(formData.id_empleado)
          : null,
        observaciones: formData.observaciones,
        kilometraje: formData.kilometraje
          ? parseInt(formData.kilometraje)
          : null,
        servicios: formData.servicios
          .filter((s) => s.id_servicio) // Solo servicios seleccionados
          .map((s) => ({
            id_servicio: parseInt(s.id_servicio),
            cantidad: parseInt(s.cantidad) || 1,
          })),
      });

      alert("Orden creada exitosamente");
      setShowModal(false);
      setFormData({
        id_vehiculo: "",
        id_empleado: "",
        observaciones: "",
        kilometraje: "",
        servicios: [{ id_servicio: "", cantidad: 1 }],
      });
      loadOrdenes();
    } catch (error) {
      console.error("Error creando orden:", error);
      alert(error.response?.data?.message || "Error al crear orden");
    }
  };

  // ✅ NUEVA FUNCIÓN: AGREGAR SERVICIO AL ARRAY
  const handleAddServicio = () => {
    setFormData({
      ...formData,
      servicios: [...formData.servicios, { id_servicio: "", cantidad: 1 }],
    });
  };

  // ✅ NUEVA FUNCIÓN: ELIMINAR SERVICIO DEL ARRAY
  const handleRemoveServicio = (index) => {
    const newServicios = formData.servicios.filter((_, i) => i !== index);
    setFormData({ ...formData, servicios: newServicios });
  };

  // ✅ NUEVA FUNCIÓN: CAMBIAR DATOS DE UN SERVICIO
  const handleServicioChange = (index, field, value) => {
    const newServicios = [...formData.servicios];
    newServicios[index][field] = value;
    setFormData({ ...formData, servicios: newServicios });
  };

  const handleUpdateEstado = async (idOrden, nuevoEstado) => {
    try {
      await ordenesService.update(idOrden, { estado: nuevoEstado });
      alert("Estado actualizado");
      loadOrdenes();
    } catch (error) {
      console.error("Error actualizando estado:", error);
      alert("Error al actualizar estado");
    }
  };

  const getEstadoBadgeClass = (estado) => {
    const classes = {
      pendiente: "badge-pendiente",
      en_proceso: "badge-en-proceso",
      completado: "badge-completado",
      entregado: "badge-entregado",
    };
    return classes[estado] || "badge-pendiente";
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      pendiente: "Pendiente",
      en_proceso: "En Proceso",
      completado: "Completado",
      entregado: "Entregado",
    };
    return labels[estado] || estado;
  };

  if (loading)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Cargando órdenes...
      </div>
    );

  return (
    <div className="ordenes-container">
      {/* ✅ HEADER CON BOTÓN NUEVA ORDEN */}
      <div className="page-header-small">
        <h1>📋 Órdenes de Servicio</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setFormData({
              id_vehiculo: "",
              id_empleado: "",
              observaciones: "",
              kilometraje: "",
              servicios: [{ id_servicio: "", cantidad: 1 }],
            });
            setShowModal(true);
          }}
        >
          <span>+</span> Nueva Orden
        </button>
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
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>

        {/* Filtros de Estado */}
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filtroEstado === "todos" ? "active" : ""}`}
            onClick={() => setFiltroEstado("todos")}
          >
            Todos
          </button>
          <button
            className={`filter-btn ${
              filtroEstado === "pendiente" ? "active" : ""
            }`}
            onClick={() => setFiltroEstado("pendiente")}
          >
            Pendientes
          </button>
          <button
            className={`filter-btn ${
              filtroEstado === "en_proceso" ? "active" : ""
            }`}
            onClick={() => setFiltroEstado("en_proceso")}
          >
            En Proceso
          </button>
          <button
            className={`filter-btn ${
              filtroEstado === "completado" ? "active" : ""
            }`}
            onClick={() => setFiltroEstado("completado")}
          >
            Completados
          </button>
          <button
            className={`filter-btn ${
              filtroEstado === "entregado" ? "active" : ""
            }`}
            onClick={() => setFiltroEstado("entregado")}
          >
            Entregados
          </button>
        </div>

        {(searchTerm || filtroEstado !== "todos") && (
          <div className="search-results-count">
            <span>
              Mostrando {ordenesFiltradas.length} de {ordenes.length} órdenes
            </span>
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
                    <td>
                      <strong>ORD-{orden.id_orden}</strong>
                    </td>
                    <td>{orden.vehiculo?.cliente?.nombre || "N/A"}</td>
                    <td>{`${orden.vehiculo?.marca || ""} ${
                      orden.vehiculo?.modelo || ""
                    }`}</td>
                    <td>
                      <span className="badge-plate">
                        {orden.vehiculo?.placas || "N/A"}
                      </span>
                    </td>
                    <td>{orden.empleado?.nombre || "Sin asignar"}</td>
                    <td>
                      {new Date(orden.fecha_entrada).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className={`badge ${getEstadoBadgeClass(orden.estado)}`}
                      >
                        {getEstadoLabel(orden.estado)}
                      </span>
                    </td>
                    <td>
                      <select
                        value={orden.estado}
                        onChange={(e) =>
                          handleUpdateEstado(orden.id_orden, e.target.value)
                        }
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
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#666",
                    }}
                  >
                    {searchTerm || filtroEstado !== "todos"
                      ? "No se encontraron resultados"
                      : "No hay órdenes registradas"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ MODAL PARA NUEVA ORDEN */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content-large"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Nueva Orden de Servicio</h2>
            <form onSubmit={handleCreateOrden}>
              {/* VEHÍCULO */}
              <div className="form-group">
                <label>Vehículo *</label>
                <select
                  value={formData.id_vehiculo}
                  onChange={(e) =>
                    setFormData({ ...formData, id_vehiculo: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar vehículo</option>
                  {vehiculos.map((v) => (
                    <option key={v.id_vehiculo} value={v.id_vehiculo}>
                      {v.marca} {v.modelo} ({v.placas}) - Cliente:{" "}
                      {v.cliente?.nombre || "N/A"}
                    </option>
                  ))}
                </select>
              </div>

              {/* MECÁNICO */}
              <div className="form-group">
                <label>Mecánico Asignado</label>
                <select
                  value={formData.id_empleado}
                  onChange={(e) =>
                    setFormData({ ...formData, id_empleado: e.target.value })
                  }
                >
                  <option value="">Sin asignar</option>
                  {empleados.map((emp) => (
                    <option key={emp.id_empleado} value={emp.id_empleado}>
                      {emp.nombre}{" "}
                      {emp.especialidad ? `- ${emp.especialidad}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* SERVICIOS */}
              <div className="form-group">
                <label>Servicios * (mínimo 1)</label>
                {formData.servicios.map((servicio, index) => (
                  <div key={index} className="servicio-row">
                    <select
                      value={servicio.id_servicio}
                      onChange={(e) =>
                        handleServicioChange(
                          index,
                          "id_servicio",
                          e.target.value
                        )
                      }
                      required
                      className="servicio-select"
                    >
                      <option value="">Seleccionar servicio</option>
                      {serviciosDisponibles.map((s) => (
                        <option key={s.id_servicio} value={s.id_servicio}>
                          {s.nombre} - ${parseFloat(s.precio).toFixed(2)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={servicio.cantidad}
                      onChange={(e) =>
                        handleServicioChange(index, "cantidad", e.target.value)
                      }
                      placeholder="Cant."
                      className="servicio-cantidad"
                    />
                    {formData.servicios.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove-servicio"
                        onClick={() => handleRemoveServicio(index)}
                        title="Eliminar servicio"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-add-servicio"
                  onClick={handleAddServicio}
                >
                  + Agregar Otro Servicio
                </button>
              </div>

              {/* KILOMETRAJE */}
              <div className="form-group">
                <label>Kilometraje del Vehículo</label>
                <input
                  type="number"
                  value={formData.kilometraje}
                  onChange={(e) =>
                    setFormData({ ...formData, kilometraje: e.target.value })
                  }
                  placeholder="Ej: 45000"
                />
              </div>

              {/* OBSERVACIONES */}
              <div className="form-group">
                <label>Observaciones</label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) =>
                    setFormData({ ...formData, observaciones: e.target.value })
                  }
                  rows="4"
                  placeholder="Describe el problema o trabajo a realizar..."
                />
              </div>

              {/* BOTONES */}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Crear Orden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .ordenes-container {
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

        /* BOTÓN PRINCIPAL */
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
        .btn-primary span {
          font-size: 20px;
        }

        /* 🔍 BÚSQUEDA Y FILTROS */
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
          margin-bottom: 16px;
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

        .filter-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .filter-btn {
          background: #2a2a2a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 10px 20px;
          color: #999;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-btn:hover {
          background: rgba(229, 9, 20, 0.1);
          color: #e50914;
          border-color: #e50914;
        }
        .filter-btn.active {
          background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
          color: #fff;
          border-color: #e50914;
        }
        .search-results-count {
          color: #999;
          font-size: 13px;
          text-align: center;
          padding: 4px;
        }

        .content-box {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 32px;
        }
        .table-container {
          overflow-x: auto;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }
        .data-table thead {
          background: rgba(229, 9, 20, 0.1);
        }
        .data-table th {
          padding: 16px;
          text-align: left;
          font-size: 13px;
          font-weight: 700;
          color: #999;
          text-transform: uppercase;
        }
        .data-table td {
          padding: 16px;
          border-top: 1px solid #2a2a2a;
          font-size: 14px;
        }
        .data-table tbody tr:hover {
          background: rgba(229, 9, 20, 0.05);
        }

        .badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .badge-pendiente {
          background: rgba(244, 67, 54, 0.2);
          color: #f44336;
        }
        .badge-en-proceso {
          background: rgba(255, 152, 0, 0.2);
          color: #ff9800;
        }
        .badge-completado {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
        }
        .badge-entregado {
          background: rgba(33, 150, 243, 0.2);
          color: #2196f3;
        }
        .badge-plate {
          background: rgba(33, 150, 243, 0.2);
          color: #2196f3;
          padding: 6px 12px;
          border-radius: 6px;
          font-weight: 700;
          font-family: monospace;
        }

        .estado-select {
          background: #2a2a2a;
          border: 1px solid #333;
          border-radius: 6px;
          padding: 8px 12px;
          color: #fff;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .estado-select:hover {
          border-color: #e50914;
        }
        .estado-select:focus {
          outline: none;
          border-color: #e50914;
        }

        /* ✅ MODAL */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease;
          padding: 20px;
          overflow-y: auto;
        }

        .modal-content-large {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 32px;
          width: 90%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
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

        .modal-content-large h2 {
          margin-bottom: 24px;
          font-size: 24px;
        }

        /* ✅ FORMULARIO */
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

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          background: #2a2a2a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 12px 16px;
          color: #fff;
          font-size: 15px;
          font-family: inherit;
          transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #e50914;
          box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.1);
        }

        .form-group textarea {
          resize: vertical;
        }

        /* ✅ SERVICIOS MÚLTIPLES */
        .servicio-row {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          align-items: center;
        }

        .servicio-select {
          flex: 3;
        }

        .servicio-cantidad {
          flex: 1;
          min-width: 80px;
        }

        .btn-remove-servicio {
          background: rgba(244, 67, 54, 0.2);
          border: 1px solid rgba(244, 67, 54, 0.3);
          color: #f44336;
          border-radius: 6px;
          padding: 12px 16px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .btn-remove-servicio:hover {
          background: #f44336;
          color: #fff;
          transform: scale(1.05);
        }

        .btn-add-servicio {
          width: 100%;
          background: rgba(76, 175, 80, 0.2);
          border: 1px solid rgba(76, 175, 80, 0.3);
          color: #4caf50;
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          margin-top: 8px;
          transition: all 0.2s;
        }

        .btn-add-servicio:hover {
          background: rgba(76, 175, 80, 0.3);
          transform: translateY(-2px);
        }

        /* ✅ BOTONES DEL MODAL */
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

        @media (max-width: 768px) {
          .page-header-small {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .modal-content-large {
            padding: 24px;
          }

          .servicio-row {
            flex-wrap: wrap;
          }

          .servicio-select,
          .servicio-cantidad {
            flex: 1 1 100%;
          }
        }
      `}</style>
    </div>
  );
}
