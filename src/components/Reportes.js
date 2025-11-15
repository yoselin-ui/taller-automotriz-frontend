import React from 'react';

export default function Reportes() {
  return (
    <div className="reportes-container">
      <div className="page-header-small">
        <h1>📊 Reportes y Estadísticas</h1>
      </div>
      <div className="content-box">
        <div className="empty-state">
          <h2>Reportes - Próximamente</h2>
          <p>Esta sección estará disponible en una próxima actualización</p>
        </div>
      </div>

      <style jsx>{`
        .reportes-container { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .page-header-small { margin-bottom: 32px; }
        .page-header-small h1 { font-size: 36px; font-weight: 900; }
        .content-box { background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 32px; }
        .empty-state { text-align: center; padding: 60px 20px; color: #666; }
        .empty-state h2 { font-size: 24px; margin-bottom: 16px; color: #999; }
        .empty-state p { font-size: 16px; }
      `}</style>
    </div>
  );
}