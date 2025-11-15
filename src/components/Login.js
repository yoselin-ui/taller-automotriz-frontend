import React, { useState } from 'react';
import authService from '../services/authService';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Por favor ingresa email y contraseña');
      setLoading(false);
      return;
    }

    try {
      const userData = await authService.login(email, password);
      setIsAnimating(true);
      setTimeout(() => {
        onLogin(userData.nombre, userData.rol);
      }, 500);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return (
    <div className={`login-container ${isAnimating ? 'fade-out' : ''}`}>
      <div className="login-background">
        <div className="animated-bg-1"></div>
        <div className="animated-bg-2"></div>
        <div className="animated-bg-3"></div>
      </div>
      
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">🔧</div>
          <h1>TALLER MECÁNICO</h1>
          <p>Sistema de Gestión Integral</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <span className="input-icon">👤</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>

          <div className="login-footer">
            <a href="#" className="link">¿Olvidaste tu contraseña?</a>
          </div>
        </form>

        <div className="demo-credentials">
          <p>💡 Demo: admin@taller.com / admin123</p>
        </div>
      </div>

      <style jsx>{`
        .login-container { width: 100vw; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0a; position: relative; overflow: hidden; animation: fadeIn 0.6s ease; }
        .login-container.fade-out { animation: fadeOut 0.5s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        .login-background { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; }
        .animated-bg-1, .animated-bg-2, .animated-bg-3 { position: absolute; opacity: 0.1; background-size: contain; background-repeat: no-repeat; background-position: center; filter: brightness(0) invert(1); }
        .animated-bg-1 { width: 800px; height: 800px; top: -200px; left: -200px; background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'); animation: float1 25s ease-in-out infinite; }
        .animated-bg-2 { width: 600px; height: 600px; bottom: -150px; right: -150px; background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'); animation: float2 30s ease-in-out infinite; }
        .animated-bg-3 { width: 700px; height: 700px; top: 50%; right: -100px; background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'); animation: float3 35s ease-in-out infinite; opacity: 0.05; }
        @keyframes float1 { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(50px, 100px) rotate(90deg); } 50% { transform: translate(0, 200px) rotate(180deg); } 75% { transform: translate(-50px, 100px) rotate(270deg); } }
        @keyframes float2 { 0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); } 33% { transform: translate(-100px, -50px) rotate(120deg) scale(1.1); } 66% { transform: translate(50px, -100px) rotate(240deg) scale(0.9); } }
        @keyframes float3 { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-100px, 50px) rotate(180deg); } }
        .login-card { background: rgba(26, 26, 26, 0.95); border: 1px solid #333; border-radius: 16px; padding: 48px; width: 100%; max-width: 440px; box-shadow: 0 24px 64px rgba(0, 0, 0, 0.8); backdrop-filter: blur(10px); z-index: 1; animation: slideUp 0.6s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .login-logo { text-align: center; margin-bottom: 40px; }
        .logo-icon { width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, #E50914 0%, #b20710 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; box-shadow: 0 8px 32px rgba(229, 9, 20, 0.4); animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { transform: scale(1); box-shadow: 0 8px 32px rgba(229, 9, 20, 0.4); } 50% { transform: scale(1.05); box-shadow: 0 12px 48px rgba(229, 9, 20, 0.6); } }
        .login-logo h1 { font-size: 32px; font-weight: 900; background: linear-gradient(135deg, #E50914 0%, #ff4757 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 8px; letter-spacing: 2px; }
        .login-logo p { color: #999; font-size: 14px; }
        .login-form { display: flex; flex-direction: column; gap: 20px; }
        .input-group { position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 16px; font-size: 20px; z-index: 1; }
        .login-input { width: 100%; padding: 16px 16px 16px 52px; background: #2a2a2a; border: 2px solid #333; border-radius: 8px; color: #fff; font-size: 15px; transition: all 0.3s; }
        .login-input:focus { outline: none; border-color: #E50914; background: #1a1a1a; }
        .login-input::placeholder { color: #666; }
        .login-input:disabled { opacity: 0.6; cursor: not-allowed; }
        .error-message { background: rgba(229, 9, 20, 0.1); border: 1px solid rgba(229, 9, 20, 0.3); color: #ff4757; padding: 12px; border-radius: 8px; font-size: 14px; text-align: center; animation: shake 0.5s; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
        .login-button { background: linear-gradient(135deg, #E50914 0%, #b20710 100%); color: #fff; border: none; border-radius: 8px; padding: 16px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s; text-transform: uppercase; letter-spacing: 1px; }
        .login-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(229, 9, 20, 0.4); }
        .login-button:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-button:active:not(:disabled) { transform: translateY(0); }
        .login-footer { text-align: center; margin-top: 16px; }
        .link { color: #999; text-decoration: none; font-size: 14px; transition: color 0.2s; }
        .link:hover { color: #E50914; }
        .demo-credentials { margin-top: 32px; padding-top: 24px; border-top: 1px solid #333; text-align: center; }
        .demo-credentials p { color: #666; font-size: 13px; background: rgba(229, 9, 20, 0.1); padding: 8px 16px; border-radius: 20px; display: inline-block; }
        @media (max-width: 768px) { .login-card { padding: 32px 24px; margin: 20px; } .animated-bg-1, .animated-bg-2, .animated-bg-3 { opacity: 0.05; } }
      `}</style>
    </div>
  );
}