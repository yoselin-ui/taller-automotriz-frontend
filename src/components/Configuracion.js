import React, { useState, useEffect } from 'react';

export default function Configuracion() {
  const [tema, setTema] = useState('oscuro'); // 'claro' o 'oscuro'
  const [fondoSeleccionado, setFondoSeleccionado] = useState('default');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    tipo: 'bug',
    descripcion: '',
    email: ''
  });

  // Cargar preferencias guardadas
  useEffect(() => {
    const temaGuardado = localStorage.getItem('tema') || 'oscuro';
    const fondoGuardado = localStorage.getItem('fondo') || 'default';
    setTema(temaGuardado);
    setFondoSeleccionado(fondoGuardado);
    aplicarTema(temaGuardado);
  }, []);

  const aplicarTema = (nuevoTema) => {
    document.documentElement.setAttribute('data-theme', nuevoTema);
    localStorage.setItem('tema', nuevoTema);
  };

  const handleTemaToggle = () => {
    const nuevoTema = tema === 'oscuro' ? 'claro' : 'oscuro';
    setTema(nuevoTema);
    aplicarTema(nuevoTema);
  };

  const handleFondoChange = (fondo) => {
    setFondoSeleccionado(fondo);
    localStorage.setItem('fondo', fondo);
    // Aplicar el fondo al body
    document.body.style.backgroundImage = fondos.find(f => f.id === fondo).imagen;
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    console.log('Reporte enviado:', reportForm);
    alert('¡Gracias por tu reporte! Lo revisaremos pronto.');
    setShowReportModal(false);
    setReportForm({ tipo: 'bug', descripcion: '', email: '' });
  };

  const fondos = [
    { id: 'default', nombre: 'Predeterminado', imagen: 'none', preview: '#141414' },
    { id: 'gradient1', nombre: 'Gradiente Rojo', imagen: 'linear-gradient(135deg, #1a0000 0%, #141414 100%)', preview: 'linear-gradient(135deg, #1a0000 0%, #141414 100%)' },
    { id: 'gradient2', nombre: 'Gradiente Azul', imagen: 'linear-gradient(135deg, #000a1a 0%, #141414 100%)', preview: 'linear-gradient(135deg, #000a1a 0%, #141414 100%)' },
    { id: 'gradient3', nombre: 'Gradiente Morado', imagen: 'linear-gradient(135deg, #1a001a 0%, #141414 100%)', preview: 'linear-gradient(135deg, #1a001a 0%, #141414 100%)' },
    { id: 'pattern1', nombre: 'Circuitos', imagen: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23e50914\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"), #141414', preview: 'repeating-linear-gradient(45deg, #E50914 0px, #E50914 2px, #141414 2px, #141414 10px)' },
    { id: 'dark', nombre: 'Negro Puro', imagen: 'none', preview: '#000000' }
  ];

  return (
    <div className="configuracion-container">
      <div className="page-header-small">
        <h1>⚙️ Configuración</h1>
        <p className="subtitle">Personaliza tu experiencia</p>
      </div>

      <div className="config-grid">
        
        {/* SECCIÓN: APARIENCIA */}
        <div className="config-section">
          <div className="section-header">
            <div className="section-icon">🎨</div>
            <h2>Apariencia</h2>
          </div>

          {/* Toggle Tema Claro/Oscuro */}
          <div className="config-item">
            <div className="config-item-info">
              <h3>Tema</h3>
              <p>Cambia entre modo claro y oscuro</p>
            </div>
            <div className="toggle-container">
              <span className="toggle-label">{tema === 'claro' ? '☀️ Claro' : '🌙 Oscuro'}</span>
              <button 
                className={`theme-toggle ${tema}`} 
                onClick={handleTemaToggle}
                aria-label="Cambiar tema"
              >
                <div className="toggle-slider">
                  <div className="toggle-icon">
                    {tema === 'claro' ? '☀️' : '🌙'}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Selector de Fondo */}
          <div className="config-item full-width">
            <div className="config-item-info">
              <h3>Fondo de Pantalla</h3>
              <p>Selecciona un fondo para la aplicación</p>
            </div>
            <div className="fondos-grid">
              {fondos.map(fondo => (
                <div 
                  key={fondo.id}
                  className={`fondo-option ${fondoSeleccionado === fondo.id ? 'selected' : ''}`}
                  onClick={() => handleFondoChange(fondo.id)}
                >
                  <div 
                    className="fondo-preview" 
                    style={{ background: fondo.preview }}
                  >
                    {fondoSeleccionado === fondo.id && (
                      <div className="selected-badge">✓</div>
                    )}
                  </div>
                  <span className="fondo-nombre">{fondo.nombre}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECCIÓN: CUENTA */}
        <div className="config-section">
          <div className="section-header">
            <div className="section-icon">👤</div>
            <h2>Cuenta</h2>
          </div>

          <div className="config-item">
            <div className="config-item-info">
              <h3>Perfil</h3>
              <p>Edita tu información personal</p>
            </div>
            <button className="btn-action">
              Editar
            </button>
          </div>

          <div className="config-item">
            <div className="config-item-info">
              <h3>Cambiar Contraseña</h3>
              <p>Actualiza tu contraseña de acceso</p>
            </div>
            <button className="btn-action">
              Cambiar
            </button>
          </div>
        </div>

        {/* SECCIÓN: NOTIFICACIONES */}
        <div className="config-section">
          <div className="section-header">
            <div className="section-icon">🔔</div>
            <h2>Notificaciones</h2>
          </div>

          <div className="config-item">
            <div className="config-item-info">
              <h3>Notificaciones por Email</h3>
              <p>Recibe actualizaciones importantes</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="switch-slider"></span>
            </label>
          </div>

          <div className="config-item">
            <div className="config-item-info">
              <h3>Recordatorios de Órdenes</h3>
              <p>Alertas sobre órdenes pendientes</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="switch-slider"></span>
            </label>
          </div>
        </div>

        {/* SECCIÓN: SOPORTE */}
        <div className="config-section">
          <div className="section-header">
            <div className="section-icon">💬</div>
            <h2>Soporte</h2>
          </div>

          <div className="config-item">
            <div className="config-item-info">
              <h3>Reportar un Problema</h3>
              <p>Ayúdanos a mejorar reportando errores</p>
            </div>
            <button 
              className="btn-action danger"
              onClick={() => setShowReportModal(true)}
            >
              🐛 Reportar
            </button>
          </div>

          <div className="config-item">
            <div className="config-item-info">
              <h3>Centro de Ayuda</h3>
              <p>Encuentra respuestas a tus preguntas</p>
            </div>
            <button className="btn-action">
              Abrir
            </button>
          </div>

          <div className="config-item">
            <div className="config-item-info">
              <h3>Acerca de</h3>
              <p>Versión 1.0.0</p>
            </div>
            <button className="btn-action">
              Ver más
            </button>
          </div>
        </div>

      </div>

      {/* MODAL DE REPORTE */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content-report" onClick={(e) => e.stopPropagation()}>
            <h2>🐛 Reportar un Problema</h2>
            <p className="modal-subtitle">Describe el problema que encontraste</p>
            
            <form onSubmit={handleReportSubmit}>
              <div className="form-group">
                <label>Tipo de Problema *</label>
                <select 
                  value={reportForm.tipo}
                  onChange={(e) => setReportForm({ ...reportForm, tipo: e.target.value })}
                  required
                >
                  <option value="bug">🐛 Error/Bug</option>
                  <option value="feature">💡 Solicitud de Función</option>
                  <option value="performance">⚡ Problema de Rendimiento</option>
                  <option value="ui">🎨 Problema de Interfaz</option>
                  <option value="other">📝 Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label>Descripción *</label>
                <textarea 
                  value={reportForm.descripcion}
                  onChange={(e) => setReportForm({ ...reportForm, descripcion: e.target.value })}
                  placeholder="Describe el problema en detalle..."
                  rows="5"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email de Contacto</label>
                <input 
                  type="email"
                  value={reportForm.email}
                  onChange={(e) => setReportForm({ ...reportForm, email: e.target.value })}
                  placeholder="tu@email.com"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowReportModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Enviar Reporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .configuracion-container { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .page-header-small { margin-bottom: 32px; }
        .page-header-small h1 { font-size: 36px; font-weight: 900; margin-bottom: 8px; }
        .subtitle { color: #999; font-size: 16px; }

        .config-grid { display: grid; gap: 24px; }
        
        .config-section { 
          background: #1a1a1a; 
          border: 1px solid #333; 
          border-radius: 16px; 
          padding: 32px; 
          animation: slideUp 0.5s ease;
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .section-header { 
          display: flex; 
          align-items: center; 
          gap: 16px; 
          margin-bottom: 24px; 
          padding-bottom: 16px; 
          border-bottom: 2px solid #2a2a2a; 
        }
        .section-icon { 
          width: 48px; 
          height: 48px; 
          background: rgba(229, 9, 20, 0.1); 
          border-radius: 12px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 24px; 
        }
        .section-header h2 { font-size: 24px; font-weight: 700; margin: 0; }

        .config-item { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 20px 0; 
          border-bottom: 1px solid #2a2a2a; 
        }
        .config-item:last-child { border-bottom: none; }
        .config-item.full-width { flex-direction: column; align-items: flex-start; }

        .config-item-info h3 { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
        .config-item-info p { font-size: 14px; color: #999; margin: 0; }

        /* TOGGLE TEMA CLARO/OSCURO */
        .toggle-container { display: flex; align-items: center; gap: 12px; }
        .toggle-label { font-size: 14px; font-weight: 600; color: #999; }
        
        .theme-toggle {
          position: relative;
          width: 80px;
          height: 40px;
          background: #2a2a2a;
          border: 2px solid #333;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.4s ease;
          padding: 0;
        }
        .theme-toggle:hover { border-color: #E50914; }
        .theme-toggle.claro { background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); }
        .theme-toggle.oscuro { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); }
        
        .toggle-slider {
          position: absolute;
          width: 32px;
          height: 32px;
          background: #fff;
          border-radius: 50%;
          top: 2px;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .theme-toggle.oscuro .toggle-slider { left: 2px; background: #2a2a2a; }
        .theme-toggle.claro .toggle-slider { left: 42px; background: #fff; }
        
        .toggle-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          font-size: 18px;
        }

        /* SELECTOR DE FONDOS */
        .fondos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 16px;
          margin-top: 16px;
          width: 100%;
        }
        .fondo-option {
          cursor: pointer;
          text-align: center;
          transition: all 0.3s;
        }
        .fondo-option:hover { transform: translateY(-4px); }
        
        .fondo-preview {
          width: 100%;
          height: 80px;
          border-radius: 12px;
          border: 3px solid #333;
          margin-bottom: 8px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .fondo-option.selected .fondo-preview {
          border-color: #E50914;
          box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.2);
        }
        .selected-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          background: #E50914;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 16px;
          animation: popIn 0.3s ease;
        }
        @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
        
        .fondo-nombre {
          font-size: 12px;
          color: #999;
          font-weight: 600;
        }

        /* SWITCH TOGGLE */
        .switch {
          position: relative;
          display: inline-block;
          width: 54px;
          height: 28px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .switch-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #2a2a2a;
          border: 2px solid #333;
          transition: .4s;
          border-radius: 28px;
        }
        .switch-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        .switch input:checked + .switch-slider {
          background: linear-gradient(135deg, #E50914 0%, #b20710 100%);
          border-color: #E50914;
        }
        .switch input:checked + .switch-slider:before {
          transform: translateX(26px);
        }

        /* BOTONES */
        .btn-action {
          background: rgba(229, 9, 20, 0.1);
          border: 1px solid rgba(229, 9, 20, 0.3);
          border-radius: 8px;
          padding: 10px 20px;
          color: #E50914;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-action:hover {
          background: #E50914;
          color: #fff;
          transform: translateY(-2px);
        }
        .btn-action.danger {
          background: rgba(244, 67, 54, 0.1);
          border-color: rgba(244, 67, 54, 0.3);
          color: #F44336;
        }
        .btn-action.danger:hover {
          background: #F44336;
          color: #fff;
        }

        /* MODAL */
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
        }
        .modal-content-report {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 32px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }
        .modal-content-report h2 {
          font-size: 28px;
          margin-bottom: 8px;
        }
        .modal-subtitle {
          color: #999;
          margin-bottom: 24px;
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
          border-color: #E50914;
          box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.1);
        }
        .form-group textarea {
          resize: vertical;
        }
        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        .btn-primary {
          flex: 1;
          background: linear-gradient(135deg, #E50914 0%, #b20710 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(229, 9, 20, 0.4);
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
          .config-item { flex-direction: column; align-items: flex-start; gap: 16px; }
          .fondos-grid { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); }
        }
      `}</style>
    </div>
  );
}