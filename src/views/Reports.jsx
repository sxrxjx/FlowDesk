import React from 'react';
import { useStore } from '../store';
import { ChevronLeft, TrendingUp, DollarSign, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Reports = () => {
  const { clients, projects, getStats } = useStore();
  const stats = getStats();

  // Mock data for the chart
  const monthlyData = [
    { month: 'Ene', value: 4200 },
    { month: 'Feb', value: 3800 },
    { month: 'Mar', value: 5100 },
    { month: 'Abr', value: 4800 },
    { month: 'May', value: stats.totalRevenue },
  ];

  const maxValue = Math.max(...monthlyData.map(d => d.value));

  return (
    <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '100px' }}>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ margin: 0 }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Crecimiento</p>
          <div className="flex-row gap-2">
            <h3 style={{ fontSize: '1.5rem' }}>+12%</h3>
            <ArrowUpRight size={16} color="var(--success)" />
          </div>
        </div>
        <div className="card" style={{ margin: 0 }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Conversión</p>
          <div className="flex-row gap-2">
            <h3 style={{ fontSize: '1.5rem' }}>64%</h3>
            <TrendingUp size={16} color="var(--info)" />
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="flex-row justify-between" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem' }}>Ingresos Mensuales</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>2026</span>
        </div>
        
        <div style={{ 
          height: '200px', 
          display: 'flex', 
          alignItems: 'flex-end', 
          justifyContent: 'space-between', 
          gap: '12px',
          paddingBottom: '20px',
          position: 'relative'
        }}>
          {/* Grid lines */}
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ 
              position: 'absolute', 
              bottom: `${(i * 33) + 20}%`, 
              left: 0, 
              right: 0, 
              borderBottom: '1px dashed #eee',
              zIndex: 0
            }}></div>
          ))}

          {monthlyData.map((d, i) => {
            const height = (d.value / maxValue) * 100;
            return (
              <div key={d.month} style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '8px',
                zIndex: 1
              }}>
                <div style={{ 
                  width: '100%', 
                  height: `${height}%`, 
                  background: i === monthlyData.length - 1 ? 'var(--gradient-primary)' : 'var(--primary-light)',
                  borderRadius: '6px',
                  position: 'relative',
                  transition: 'height 1s ease-out'
                }}>
                  {i === monthlyData.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '-30px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--text-primary)',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.65rem',
                      fontWeight: 600
                    }}>
                      {d.value}€
                    </div>
                  )}
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Client Breakdown */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Ingresos por Cliente</h3>
        <div className="card" style={{ padding: '8px 20px' }}>
          {clients.sort((a, b) => b.ingresos - a.ingresos).map((client, i) => (
            <div key={client.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '16px 0',
              borderBottom: i === clients.length - 1 ? 'none' : '1px solid #f1f5f9'
            }}>
              <div className="flex-row gap-3">
                <img src={client.foto} alt={client.nombre} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{client.nombre}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0 }}>{client.especialidad}</p>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>{client.ingresos.toLocaleString()}€</p>
            </div>
          ))}
        </div>
      </div>

      {/* Details List */}
      <div>
        <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Detalles de Proyectos Recientes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {projects.filter(p => p.presupuesto > 0).slice(0, 4).map(project => (
            <Link to={`/proyectos/${project.id}`} key={project.id} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ margin: 0, padding: '16px' }}>
                <div className="flex-row justify-between">
                  <div className="flex-row gap-3">
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '12px', 
                      background: 'var(--primary-light)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'var(--primary)'
                    }}>
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', marginBottom: '2px' }}>{project.titulo}</h4>
                      <p style={{ fontSize: '0.7rem' }}>Presupuesto aprobado</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--success)', margin: 0 }}>+{project.presupuesto}€</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', margin: 0 }}>{project.fecha_inicio}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
