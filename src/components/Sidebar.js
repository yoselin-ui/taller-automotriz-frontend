import React from 'react';

export default function Sidebar({ isOpen, currentView, setCurrentView, currentUser, onLogout }) {
  const menuItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard', section: 'main' },
    { id: 'clientes', icon: '👥', label: 'Clientes', section: 'gestión' },
    { id: 'vehiculos', icon: '🚗', label: 'Vehículos', section: 'gestión' },
    { id: 'servicios', icon: '🔧', label: 'Servicios', section: 'gestión' },
    { id: 'empleados', icon: '👨‍🔧', label: 'Empleados', section: 'gestión' },
    { id: 'ordenes', icon: '📋', label: 'Órdenes de Servicio', section: 'operaciones' },
    { id: 'facturas', icon: '🧾', label: 'Facturas', section: 'operaciones' },
    { id: 'reportes', icon: '📊', label: 'Reportes', section: 'administración' },
    { id: 'configuracion', icon: '⚙️', label: 'Configuración', section: 'sistema' },
  ];

  const sections = {
    main: 'Principal',
    gestión: 'Gestión',
    operaciones: 'Operaciones',
    administración: 'Administración',
    sistema: 'Sistema'
  };

  return (
    <div className={`sidebar ${!isOpen ? 'closed' : ''}`}>
      <div className="logo">
        <div className="logo-icon-small">🔧</div>
        <h1>TALLER</h1>
      </div>

      {Object.entries(sections).map(([key, label]) => (
        <div key={key}>
          <div className="nav-section">{label}</div>
          <nav className="nav-menu">
           {menuItems.filter(item => item.section === key).map(item => (
  <a              // ✅ Ahora sí tiene 
    key={item.id}
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView(item.id);
                }}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      ))}

      <div className="user-profile">
        <div className="user-avatar">👤</div>
        <div className="user-info">
          <div className="user-name">{currentUser?.nombre}</div>
          <span className="user-role">{currentUser?.rol}</span>
        </div>
        <button className="logout-btn" onClick={onLogout} title="Cerrar Sesión">
          🚪
        </button>
      </div>

      <style jsx>{`
        .sidebar { position: fixed; left: 0; top: 0; height: 100vh; width: 260px; background: linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%); padding: 24px 0; z-index: 1000; transition: transform 0.3s ease; box-shadow: 4px 0 20px rgba(0, 0, 0, 0.5); overflow-y: auto; }
        .sidebar::-webkit-scrollbar { width: 6px; }
        .sidebar::-webkit-scrollbar-track { background: #0d0d0d; }
        .sidebar::-webkit-scrollbar-thumb { background: #E50914; border-radius: 3px; }
        .sidebar.closed { transform: translateX(-260px); }
        .logo { padding: 0 24px 24px; border-bottom: 1px solid #333; display: flex; align-items: center; gap: 12px; }
        .logo-icon-small { width: 40px; height: 40px; background: linear-gradient(135deg, #E50914 0%, #b20710 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .logo h1 { font-size: 24px; font-weight: 900; background: linear-gradient(135deg, #E50914 0%, #ff4757 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: 2px; }
        .nav-section { padding: 20px 24px 8px; font-size: 11px; font-weight: 700; color: #808080; text-transform: uppercase; letter-spacing: 1px; }
        .nav-menu { margin-bottom: 8px; }
        .nav-item { display: flex; align-items: center; padding: 12px 24px; color: #b3b3b3; text-decoration: none; transition: all 0.2s; cursor: pointer; font-size: 14px; font-weight: 500; }
        .nav-item:hover, .nav-item.active { color: #fff; background: rgba(229, 9, 20, 0.1); border-left: 4px solid #E50914; padding-left: 20px; }
        .nav-item .icon { width: 24px; height: 24px; margin-right: 12px; font-size: 18px; }
        .user-profile { margin-top: auto; padding: 24px; border-top: 1px solid #333; display: flex; align-items: center; gap: 12px; }
        .user-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #E50914 0%, #b20710 100%); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .user-info { flex: 1; min-width: 0; }
        .user-name { font-size: 14px; font-weight: 600; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-role { font-size: 11px; color: #666; background: rgba(229, 9, 20, 0.2); padding: 2px 8px; border-radius: 4px; display: inline-block; }
        .logout-btn { width: 36px; height: 36px; background: rgba(229, 9, 20, 0.1); border: 1px solid rgba(229, 9, 20, 0.3); border-radius: 8px; color: #E50914; cursor: pointer; font-size: 18px; transition: all 0.2s; flex-shrink: 0; }
        .logout-btn:hover { background: #E50914; color: #fff; transform: scale(1.1); }
        @media (max-width: 768px) { .sidebar { transform: translateX(-260px); } .sidebar.open { transform: translateX(0); } }
      `}</style>
    </div>
  );
}