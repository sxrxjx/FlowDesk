import React, { useState } from 'react';
import { useStore } from '../store';
import { Bell, Plus, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ProjectList() {
  const { projects, user } = useStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('TODOS');

  const categories = ['TODOS', 'Ilustración', 'Branding', 'Web', 'UX/UI'];

  const filteredProjects = filter === 'TODOS' 
    ? projects 
    : projects.filter(p => p.categoria?.toLowerCase() === filter.toLowerCase());

  return (
    <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '100px', minHeight: '100vh', position: 'relative' }}>

      {/* Page Title & Add Button */}
      <div className="flex-row justify-between" style={{ marginBottom: '24px', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>PANEL DE CONTROL</p>
          <h1 style={{ fontSize: '2rem', lineHeight: '1.1' }}>Proyectos<br/>Activos</h1>
        </div>
        <button className="btn-primary" onClick={() => navigate('/proyectos/nuevo')} style={{ width: 'auto', padding: '12px 16px', borderRadius: '16px', fontSize: '0.85rem' }}>
          <Plus size={18} />
          Nuevo<br/>Proyecto
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '8px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '0.7rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              background: filter === cat ? '#e11d48' : '#f1f5f9',
              color: filter === cat ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {filteredProjects.map(project => (
          <div key={project.id} className="card" onClick={() => navigate(`/proyectos/${project.id}`)} style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', margin: 0 }}>
            {/* Cover Image */}
            <div style={{ height: '180px', position: 'relative' }}>
              <img src={project.imagen || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'} alt={project.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              {/* Payment Badge */}
              <div style={{ 
                position: 'absolute', 
                top: '16px', 
                left: '16px', 
                background: project.pagado ? '#16a34a' : 'rgba(255,255,255,0.9)', 
                color: project.pagado ? 'white' : '#9f1239',
                padding: '4px 10px', 
                borderRadius: '12px', 
                fontSize: '0.6rem', 
                fontWeight: 800,
                backdropFilter: project.pagado ? 'none' : 'blur(4px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: project.pagado ? 'none' : '1px solid rgba(159, 18, 57, 0.2)'
              }}>
                {project.pagado ? 'COBRADO' : 'PENDIENTE'}
              </div>

              {project.categoria && (
                <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'white', padding: '4px 12px', borderRadius: '16px', fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.5px' }}>
                  {project.categoria}
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{project.titulo}</h2>
              <p style={{ fontSize: '0.85rem', marginBottom: '20px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {project.descripcion_corta || (project.descripcion?.split(' ').slice(0, 10).join(' ') + '...')}
              </p>

              <div className="flex-row justify-between" style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.5px' }}>PROGRESO</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: project.progreso > 80 ? '#0d9488' : 'var(--primary)' }}>{project.progreso}%</span>
              </div>
              <div className="progress-track" style={{ marginBottom: '24px', background: '#f1f5f9' }}>
                <div className="progress-fill" style={{ width: `${project.progreso}%`, background: project.progreso > 80 ? '#14b8a6' : (project.progreso < 40 ? '#f43f5e' : 'var(--gradient-primary)') }}></div>
              </div>

              <div style={{ height: '1px', background: '#f1f5f9', marginBottom: '16px' }}></div>

              <div className="flex-row justify-between" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex-row gap-2">
                  <Calendar size={14} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>{new Date(project.fecha_entrega).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty / New Project Card */}
        <div onClick={() => navigate('/proyectos/nuevo')} style={{ border: '2px dashed #e2e8f0', borderRadius: '24px', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Plus size={24} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Nuevo Proyecto</h3>
          <p style={{ fontSize: '0.85rem' }}>Empieza una nueva aventura creativa hoy.</p>
        </div>
      </div>


    </div>
  );
}
