import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { ChevronLeft, Edit2, Phone, Mail, MessageSquare, Briefcase } from 'lucide-react';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getClient, getClientProjects } = useStore();
  
  const client = getClient(id);
  const projects = getClientProjects(id);

  // Calculate dynamic revenue based on paid projects
  const totalClientRevenue = projects
    .filter(p => p.pagado)
    .reduce((sum, p) => sum + (Number(p.presupuesto) || 0), 0);

  if (!client) return <div className="p-8">Cliente no encontrado</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '100px' }}>
      {/* Page Title & Back Action */}
      <div className="flex-row justify-between" style={{ marginBottom: '32px', alignItems: 'center' }}>
        <button className="btn-icon" onClick={() => navigate(-1)} style={{ boxShadow: 'none' }}>
          <ChevronLeft size={24} />
        </button>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Ficha del Cliente</h2>
        <button className="btn-icon" onClick={() => navigate(`/clientes/editar/${client.id}`)} style={{ boxShadow: 'none' }}>
          <Edit2 size={20} color="var(--primary)" />
        </button>
      </div>

      {/* Profile Header */}
      <div className="flex-col" style={{ alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <div style={{ 
            width: 108, 
            height: 108, 
            background: 'var(--gradient-primary)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <img src={client.foto} alt={client.nombre} style={{ width: 100, height: 100, borderRadius: '50%', border: '4px solid white', objectFit: 'cover' }} />
          </div>
          <div style={{ position: 'absolute', bottom: 4, right: 4, width: 24, height: 24, background: 'var(--success)', borderRadius: '50%', border: '3px solid white' }}></div>
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{client.nombre}</h2>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{client.especialidad}</p>
        
        {/* Action Buttons */}
        <div className="flex-row gap-4" style={{ marginTop: '24px' }}>
          <a href={`tel:${client.telefono}`} className="btn-icon" style={{ width: 48, height: 48, textDecoration: 'none' }}>
            <Phone size={20} />
          </a>
          <a href={`mailto:${client.email}`} className="btn-icon" style={{ width: 48, height: 48, background: 'var(--primary)', color: 'white', textDecoration: 'none' }}>
            <Mail size={20} />
          </a>
          <a href={`https://wa.me/${client.telefono?.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-icon" style={{ width: 48, height: 48, textDecoration: 'none' }}>
            <MessageSquare size={20} color="#22c55e" />
          </a>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 0, border: '1px solid #f1f5f9' }}>
          <div style={{ width: 40, height: 40, background: 'var(--primary-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
             <Briefcase size={20} color="var(--primary)" />
          </div>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '8px' }}>Ingresos Totales</p>
          <h3 style={{ fontSize: '1.4rem' }}>{totalClientRevenue.toLocaleString()}€</h3>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 0, border: '1px solid #f1f5f9' }}>
          <div style={{ width: 40, height: 40, background: '#fce7f3', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
             <Rocket size={20} color="var(--secondary)" />
          </div>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '8px' }}>Proyectos Activos</p>
          <h3 style={{ fontSize: '1.4rem' }}>{projects.filter(p => p.estado !== 'completado').length}</h3>
        </div>
      </div>

        {projects.length === 0 ? (
          <div className="card" style={{ padding: '40px 20px', textAlign: 'center', border: '1px dashed var(--text-light)', background: 'transparent' }}>
            <div style={{ width: 48, height: 48, background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Briefcase size={24} color="var(--text-light)" />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Todavía no hay ningún proyecto registrado para este cliente.</p>
          </div>
        ) : (
          <>
            {/* Recent Projects (Last 2) */}
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Proyectos Recientes</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
              {projects.slice(0, 2).map(proj => (
                <Link to={`/proyectos/${proj.id}`} key={proj.id} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ margin: 0, border: '1px solid #f1f5f9' }}>
                    <div className="flex-row justify-between" style={{ marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{proj.titulo}</h4>
                      <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>{proj.categoria}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', marginBottom: '16px' }}>Iniciado el {new Date(proj.fecha_inicio).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    
                    <div className="flex-row justify-between" style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Progreso</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{proj.progreso}%</span>
                    </div>
                    <div className="progress-track" style={{ height: 8 }}>
                      <div className="progress-fill" style={{ width: `${proj.progreso}%`, background: proj.estado === 'completado' ? 'var(--success)' : 'var(--gradient-primary)' }}></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Project History Grid */}
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Historial de Proyectos</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {projects.map(proj => (
                <Link to={`/proyectos/${proj.id}`} key={proj.id} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ margin: 0, padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid #f1f5f9', height: '100%' }}>
                    {proj.imagen ? (
                      <img src={proj.imagen} alt={proj.titulo} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : (
                      <div style={{ width: '100%', height: '80px', background: 'var(--bg-main)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Briefcase size={24} color="var(--text-light)" />
                      </div>
                    )}
                    <div>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.2' }}>
                        {proj.titulo}
                      </h4>
                      <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>{proj.categoria}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
    </div>
  );
}

// Temporary internal components just for icons
const Rocket = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
  </svg>
);
