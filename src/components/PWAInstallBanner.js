import React from 'react';
import { usePWA } from '../hooks/usePWA';

function PWAInstallBanner() {
  const { isInstallable, isOnline, installPWA } = usePWA();

  if (!isInstallable && isOnline) return null;

  return (
    <>
      {isInstallable && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 99999,
          background: 'linear-gradient(135deg, #E50914 0%, #b20710 100%)',
          padding: '16px',
          boxShadow: '0 4px 20px rgba(229, 9, 20, 0.5)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{ fontSize: '32px' }}>📱</div>
            <div style={{ flex: 1 }}>
              <strong style={{ color: '#fff', display: 'block' }}>Instala Gas Monster</strong>
              <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '13px' }}>
                Accede rápido desde tu pantalla de inicio
              </p>
            </div>
            <button onClick={installPWA} style={{
              background: '#fff',
              color: '#E50914',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              fontWeight: 700,
              cursor: 'pointer'
            }}>
              Instalar
            </button>
          </div>
        </div>
      )}

      {!isOnline && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 99999,
          background: '#FF9800',
          padding: '12px',
          textAlign: 'center',
          color: '#fff'
        }}>
          📡 Sin conexión - Trabajando offline
        </div>
      )}
    </>
  );
}

export default PWAInstallBanner;