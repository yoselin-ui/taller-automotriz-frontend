import React from 'react';
import Dashboard from './Dashboard';
import Clientes from './Clientes';
import Vehiculos from './Vehiculos';
import Servicios from './Servicios';
import Empleados from './Empleados';
import OrdenesServicio from './OrdenesServicio';
import Facturas from './Facturas';
import Reportes from './Reportes';
import Configuracion from './Configuracion';

export default function MainContent({ currentView, sidebarOpen, setSidebarOpen }) {
  return (
    <div className={`main-content ${!sidebarOpen ? 'expanded' : ''}`}>
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <span></span>
      </button>

      <div className="content-wrapper">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'clientes' && <Clientes />}
        {currentView === 'vehiculos' && <Vehiculos />}
        {currentView === 'servicios' && <Servicios />}
        {currentView === 'empleados' && <Empleados />}
        {currentView === 'ordenes' && <OrdenesServicio />}
        {currentView === 'facturas' && <Facturas />}
        {currentView === 'reportes' && <Reportes />}
        {currentView === 'configuracion' && <Configuracion />}
      </div>

      <style jsx>{`
        .main-content { margin-left: 260px; transition: margin-left 0.3s ease; min-height: 100vh; width: calc(100% - 260px); background: #141414; }
        .main-content.expanded { margin-left: 0; width: 100%; }
        .sidebar-toggle { position: fixed; left: 12px; top: 12px; width: 40px; height: 40px; background: rgba(20, 20, 20, 0.9); border: 1px solid #333; border-radius: 8px; cursor: pointer; z-index: 999; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
        .sidebar-toggle:hover { background: #E50914; border-color: #E50914; }
        .sidebar-toggle span { display: block; width: 20px; height: 2px; background: #fff; position: relative; }
        .sidebar-toggle span::before, .sidebar-toggle span::after { content: ''; position: absolute; width: 20px; height: 2px; background: #fff; left: 0; }
        .sidebar-toggle span::before { top: -6px; }
        .sidebar-toggle span::after { top: 6px; }
        .content-wrapper { padding: 20px; padding-top: 70px; }
        @media (max-width: 768px) { .main-content { margin-left: 0; width: 100%; } }
      `}</style>
    </div>
  );
}