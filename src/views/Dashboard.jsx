import React from 'react';
import { useStore } from '../store';
import { Bell, Rocket, UserPlus, Calendar as CalendarIcon, Lightbulb, Plus } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link, useNavigate } from 'react-router-dom';
import Calendar from '../components/Calendar';

export default function Dashboard() {
  const { getStats, projects, notifications, markAsRead, clearNotifications, weeklyWorkHours, user } = useStore();
  const stats = getStats();
  const navigate = useNavigate();
  const [hoveredBar, setHoveredBar] = React.useState(null);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const proximasEntregas = projects
    .filter(p => p.estado !== 'completado')
    .sort((a, b) => new Date(a.fecha_entrega) - new Date(b.fecha_entrega))
    .slice(0, 2); // Get next 2

  const formatFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    if (isToday(fecha)) return 'Hoy';
    if (isTomorrow(fecha)) return 'Mañana';
    return format(fecha, 'dd MMM', { locale: es });
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '100px' }}>
      
      {/* Personalized Hero */}
      <div style={{ 
        marginBottom: '32px', 
        marginTop: '20px',
        padding: '40px 32px',
        borderRadius: '32px',
        background: 'radial-gradient(circle at top right, rgba(225, 29, 72, 0.15) 0%, rgba(245, 158, 11, 0.05) 50%, transparent 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <h1 style={{ 
          fontSize: '3.2rem', 
          fontWeight: 900, 
          color: 'var(--text-primary)', 
          letterSpacing: '-1.5px',
          lineHeight: 1
        }}>
          ¡Bienvenidx, <br />
          <span style={{ 
            background: 'var(--gradient-primary)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
            fontSize: '4.2rem'
          }}>
            {user?.nombre || 'Creativx'}
          </span>!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '12px', fontWeight: 500 }}>
          Tienes {stats.activeProjects} proyectos activos esperando tu toque mágico.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 0, minHeight: '140px', padding: '24px' }}>
          <div className="flex-row justify-between" style={{ width: '100%', marginBottom: '16px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Proyectos</p>
            <Rocket size={32} color="var(--secondary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', lineHeight: 1, marginBottom: '4px' }}>{stats.activeProjects}</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Activos ahora</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 0, minHeight: '140px', padding: '24px' }}>
          <div className="flex-row justify-between" style={{ width: '100%', marginBottom: '16px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Clientes</p>
            <UserPlus size={32} color="#f59e0b" />
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', lineHeight: 1, marginBottom: '4px' }}>{stats.newClients}</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Meta: 8</p>
          </div>
        </div>

        {/* Revenue Card (Gradient) - Full Width */}
        <div className="card" style={{ background: 'var(--gradient-primary)', color: 'white', gridColumn: 'span 2', margin: 0 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', marginBottom: '8px' }}>Ingresos del Mes</p>
          <div className="flex-row gap-2" style={{ alignItems: 'baseline', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'white' }}>{stats.totalRevenue.toLocaleString()}€</h2>
            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>EUR</span>
          </div>
          <Link to="/reportes">
            <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
              VER REPORTES
            </button>
          </Link>
        </div>
      </div>

      {/* Próximas Entregas */}
      <div style={{ marginBottom: '24px' }}>
        <div className="flex-row justify-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1rem' }}>Próximas entregas</h3>
          <Link to="/proyectos" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600 }}>VER TODO</span>
          </Link>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {proximasEntregas.map((proj) => (
            <Link to={`/proyectos/${proj.id}`} key={proj.id} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ margin: 0 }}>
                <div className="flex-row justify-between" style={{ marginBottom: '12px' }}>
                  <span className={`badge ${proj.urgencia}`}>{proj.urgencia}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{formatFecha(proj.fecha_entrega)}</span>
                </div>
                <h4 style={{ marginBottom: '4px' }}>{proj.titulo}</h4>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${proj.progreso}%` }}></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Rendimiento Semanal (Mock Chart) */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="flex-row justify-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1rem' }}>Rendimiento Semanal</h3>
          <Link to="/registro-jornada" className="flex-row gap-1" style={{ textDecoration: 'none', background: 'var(--primary-light)', padding: '4px 12px', borderRadius: '12px', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 700 }}>
            <Plus size={14} />
            REGISTRAR
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', gap: '8px', paddingBottom: '20px' }}>
          {weeklyWorkHours.map((data, i) => (
            <div 
              key={data.day} 
              onMouseEnter={() => setHoveredBar(i)}
              onMouseLeave={() => setHoveredBar(null)}
              style={{ 
                width: '100%', 
                height: `${data.height}%`, 
                background: i % 2 === 0 ? 'var(--primary)' : 'var(--secondary)',
                borderRadius: '6px 6px 0 0',
                opacity: i === hoveredBar ? 1 : 0.7,
                cursor: 'default',
                position: 'relative',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
                transform: i === hoveredBar ? 'scaleX(1.05)' : 'scaleX(1)'
              }}
            >
              {hoveredBar === i && (
                <div style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 10px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#1e1e1e',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 20,
                  pointerEvents: 'none'
                }}>
                  {data.hours}h
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '5px solid #1e1e1e'
                  }}></div>
                </div>
              )}
              <span style={{ 
                position: 'absolute', 
                top: '105%', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                fontSize: '0.65rem', 
                fontWeight: 600, 
                color: 'var(--text-secondary)' 
              }}>
                {data.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendario */}
      <div style={{ marginBottom: '24px' }}>
        <div className="flex-row justify-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1rem' }}>Calendario</h3>
          <CalendarIcon size={20} color="#e11d48" />
        </div>
        <Calendar />
      </div>

      {/* Tip del día */}
      <div style={{ background: '#fdf2f8', border: '1px solid #fce7f3', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
        <div className="flex-row gap-2" style={{ marginBottom: '8px', color: 'var(--secondary)' }}>
          <Lightbulb size={20} />
          <h4 style={{ fontSize: '0.9rem' }}>Tip del día</h4>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#831843' }}>
          Optimiza tu flujo de trabajo: Agrupa tus revisiones de diseño para los martes y jueves para mantener el enfoque creativo el resto de la semana.
        </p>
      </div>

    </div>
  );
}
