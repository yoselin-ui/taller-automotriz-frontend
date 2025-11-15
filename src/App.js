import React, { useState, useEffect } from 'react';
import GasMonsterAI from './components/GasMonsterAI';
import FloatingBubble from './FloatingBubble';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import PWAInstallBanner from './components/PWAInstallBanner';
import authService from './services/authService';
import './App.css';

export default function TallerMecanicoApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showGasMonster, setShowGasMonster] = useState(false);

  useEffect(() => {
    if (authService.isLoggedIn()) {
      const user = authService.getCurrentUser();
      setIsLoggedIn(true);
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (nombre, rol) => {
    setIsLoggedIn(true);
    setCurrentUser({ nombre, rol });
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentView('dashboard');
    setShowGasMonster(false);
  };

  if (!isLoggedIn) {
    return (
      <>
        <PWAInstallBanner />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      <PWAInstallBanner />
      {showGasMonster ? (
        <GasMonsterAI onClose={() => setShowGasMonster(false)} />
      ) : (
        <>
          <div className="app-container">
            <Sidebar 
              isOpen={sidebarOpen} 
              currentView={currentView} 
              setCurrentView={setCurrentView}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
            <MainContent 
              currentView={currentView} 
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </div>
          <FloatingBubble onClick={() => setShowGasMonster(true)} />
        </>
      )}
    </>
  );
}