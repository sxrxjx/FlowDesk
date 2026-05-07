import { BrowserRouter as Router, Routes, Route, NavLink, useLocation, useNavigate, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Home, LayoutDashboard, Users, FolderKanban, Settings, Bell, ChevronLeft, Plus, User } from 'lucide-react';
import { useStore } from './store';
import Login from './views/Login';
import Register from './views/Register';
import Welcome from './views/Welcome';

// Import Views
import Dashboard from './views/Dashboard';
import ClientList from './views/ClientList';
import ClientDetail from './views/ClientDetail';
import NewClient from './views/NewClient';
import EditClient from './views/EditClient';
import ProjectDetail from './views/ProjectDetail';
import ProjectList from './views/ProjectList';
import NewProject from './views/NewProject';
import EditProject from './views/EditProject';
import Reports from './views/Reports';
import WorkLog from './views/WorkLog';
import Profile from './views/Profile';

function TopBar() {
  const { user, notifications, markAsRead, clearNotifications } = useStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="top-bar">
      <div className="flex-row gap-3">
        <img 
          src={user?.foto || "https://i.pravatar.cc/150?img=11"} 
          alt="Profile" 
          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', cursor: 'pointer', border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} 
          onClick={() => navigate('/perfil')}
        />
        <h1 className="app-title" onClick={() => navigate('/')}>FlowDesk</h1>
      </div>
      
      <div style={{ position: 'relative' }}>
        <button className="btn-icon" onClick={() => setShowNotifications(!showNotifications)} style={{ boxShadow: 'none', background: 'transparent' }}>
          <Bell size={20} color="var(--primary)" />
          {unreadCount > 0 && (
            <div style={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10, background: 'var(--danger)', borderRadius: '50%', border: '2px solid white' }}></div>
          )}
        </button>

        {showNotifications && (
          <div className="card animate-fade-in" style={{ 
            position: 'absolute', 
            top: '50px', 
            right: 0, 
            width: '280px', 
            zIndex: 2000, 
            padding: '16px',
            maxHeight: '400px',
            overflowY: 'auto',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid #f1f5f9'
          }}>
            <div className="flex-row justify-between" style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '0.9rem' }}>Notificaciones</h3>
              <button onClick={clearNotifications} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>LIMPIAR</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notifications.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px 0' }}>No tienes notificaciones</p>
              ) : (
                notifications.map(n => (
                  <div 
                    key={n.id} 
                    onClick={() => { markAsRead(n.id); navigate(n.link); setShowNotifications(false); }}
                    style={{ 
                      padding: '8px', 
                      borderRadius: '8px', 
                      background: n.read ? 'transparent' : 'var(--primary-light)',
                      cursor: 'pointer',
                      borderLeft: n.read ? 'none' : '3px solid var(--primary)'
                    }}
                  >
                    <p style={{ fontSize: '0.8rem', fontWeight: n.read ? 400 : 700, marginBottom: '2px' }}>{n.title}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function BottomNavigation() {
  const location = useLocation();
  const hideNavPaths = []; // Navbar visible everywhere
  
  if (hideNavPaths.some(path => location.pathname.includes(path))) {
    return null;
  }

  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={20} />
        <span>Inicio</span>
      </NavLink>
      <NavLink to="/proyectos" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <FolderKanban size={20} />
        <span>Proyectos</span>
      </NavLink>
      <NavLink to="/clientes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Users size={20} />
        <span>Clientes</span>
      </NavLink>
      <NavLink to="/perfil" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <User size={20} />
        <span>Perfil</span>
      </NavLink>
    </nav>
  );
}

function App() {
  const { fetchData, isLoggedIn, loading } = useStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-primary)', color: 'white' }}>
        <div className="animate-fade-in" style={{ textAlign: 'center' }}>
          <Plus size={48} className="animate-pulse" />
          <h2 style={{ marginTop: '16px', fontWeight: 800, fontSize: '1.5rem' }}>FlowDesk</h2>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="*" element={<Welcome />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <TopBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<ClientList />} />
          <Route path="/clientes/nuevo" element={<NewClient />} />
          <Route path="/clientes/editar/:id" element={<EditClient />} />
          <Route path="/clientes/:id" element={<ClientDetail />} />
          <Route path="/proyectos" element={<ProjectList />} />
          <Route path="/proyectos/nuevo" element={<NewProject />} />
          <Route path="/proyectos/editar/:id" element={<EditProject />} />
          <Route path="/proyectos/:id" element={<ProjectDetail />} />
          <Route path="/reportes" element={<Reports />} />
          <Route path="/registro-jornada" element={<WorkLog />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;
