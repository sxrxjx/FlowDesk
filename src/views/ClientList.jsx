import React, { useState } from 'react';
import { useStore } from '../store';
import { Search, Plus, Bell, AlertCircle, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ClientList() {
  const { clients, projects, user, notifications, markAsRead, clearNotifications } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredClients = clients.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientActiveProjectsCount = (clientId) => {
    return projects.filter(p => p.cliente_id === clientId && p.estado !== 'completado').length;
  };

  const hasUnpaidProjects = (clientId) => {
    return projects.some(p => p.cliente_id === clientId && !p.pagado);
  };

  return (
    <>
      <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '100px', minHeight: '100vh' }}>

        {/* Page Title */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>ADMINISTRACIÓN</p>
          <h1 style={{ fontSize: '2rem', lineHeight: '1.1' }}>Clientes</h1>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Gestiona tu red creativa y el estado de sus proyectos.
        </p>

        {/* Search Bar */}
        <div className="input-field" style={{ marginBottom: '24px', background: 'white' }}>
          <Search size={20} className="input-icon" color="var(--text-light)" />
          <input 
            type="text" 
            placeholder="Buscar cliente..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Clients List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredClients.map(client => {
            const activeCount = getClientActiveProjectsCount(client.id);
            const unpaid = hasUnpaidProjects(client.id);
            
            return (
              <div key={client.id} className="card" onClick={() => navigate(`/clientes/${client.id}`)} style={{ cursor: 'pointer', margin: 0, border: unpaid ? '1px solid #fee2e2' : '1px solid transparent' }}>
                <div className="flex-row gap-4" style={{ marginBottom: '16px' }}>
                  <img src={client.foto} alt={client.nombre} style={{ width: 60, height: 60, borderRadius: '16px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div className="flex-row justify-between">
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{client.nombre}</h3>
                      {unpaid && <AlertCircle size={20} color="var(--danger)" />}
                    </div>
                    <p style={{ fontSize: '0.85rem' }}>{client.especialidad}</p>
                  </div>
                </div>
                
                <div className="flex-row justify-between" style={{ background: '#f8fafc', padding: '10px 16px', borderRadius: '12px' }}>
                  <div className="flex-row gap-2">
                    <Briefcase size={16} color="var(--text-secondary)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {activeCount} {activeCount === 1 ? 'proyecto activo' : 'proyectos activos'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>VER FICHA</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAB Add Client - truly fixed outside animation container */}
      <Link to="/clientes/nuevo" style={{
        position: 'fixed',
        bottom: 'calc(var(--bottom-nav-height) + 20px)',
        left: '50%',
        marginLeft: '160px', // Centers it relative to the 480px container (240 - 56 - 24)
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'var(--gradient-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 2000
      }}>
        <Plus size={28} />
      </Link>
    </>
  );
}
