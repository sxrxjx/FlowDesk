import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ChevronLeft, Save, Clock, Calendar as CalendarIcon, Bell } from 'lucide-react';

export default function WorkLog() {
  const { weeklyWorkHours, updateWeeklyWorkHours, user, notifications, markAsRead, clearNotifications } = useStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Load existing values from store
  const [formData, setFormData] = useState(() => {
    const initialData = { 'L': 0, 'M': 0, 'X': 0, 'J': 0, 'V': 0, 'S': 0, 'D': 0 };
    weeklyWorkHours.forEach(item => {
      if (initialData.hasOwnProperty(item.day)) {
        initialData[item.day] = item.hours;
      }
    });
    return initialData;
  });

  const handleInputChange = (day, value) => {
    setFormData(prev => ({ ...prev, [day]: value === '' ? '' : parseFloat(value) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateWeeklyWorkHours(formData);
    navigate('/');
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '100px' }}>
      {/* Unified Header */}

      {/* Page Title */}
      <div className="flex-row gap-4" style={{ marginBottom: '32px' }}>
        <button onClick={() => navigate(-1)} className="btn-icon" style={{ boxShadow: 'none', background: 'transparent' }}>
          <ChevronLeft size={24} color="var(--primary)" />
        </button>
        <h1 style={{ fontSize: '1.5rem' }}>Registro de Jornada</h1>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="flex-row gap-3" style={{ marginBottom: '20px', color: 'var(--primary)' }}>
          <Clock size={24} />
          <p style={{ fontWeight: 600 }}>Horas trabajadas esta semana</p>
        </div>
        
        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
              <div key={day} className="flex-row justify-between" style={{ 
                padding: '12px 0', 
                borderBottom: '1px solid #f1f5f9' 
              }}>
                <div className="flex-row gap-3">
                  <div style={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: '10px', 
                    background: 'var(--primary-light)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: 'var(--primary)'
                  }}>
                    {day}
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{getDayFullName(day)}</span>
                </div>
                <div className="flex-row gap-2">
                  <input 
                    type="number" 
                    step="0.5"
                    min="0"
                    max="24"
                    placeholder="0"
                    value={formData[day]}
                    onChange={(e) => handleInputChange(day, e.target.value)}
                    style={{ 
                      width: '70px', 
                      padding: '10px', 
                      borderRadius: '12px', 
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '1rem',
                      outline: 'none',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>h</span>
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '32px', padding: '18px' }}>
            <Save size={20} />
            GUARDAR JORNADA SEMANAL
          </button>
        </form>
      </div>

      <div className="card" style={{ background: 'var(--gradient-subtle)', border: 'none', padding: '24px' }}>
        <div className="flex-row gap-3">
          <CalendarIcon size={24} color="var(--primary)" />
          <div>
            <p style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
              Promedio diario actual: <strong>{(Object.values(formData).reduce((a,b)=> (parseFloat(a)||0) + (parseFloat(b)||0), 0) / 7).toFixed(1)}h</strong>
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Los cambios se reflejarán inmediatamente en tus gráficas de rendimiento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to get full names
function getDayFullName(day) {
  const names = {
    'L': 'Lunes',
    'M': 'Martes',
    'X': 'Miércoles',
    'J': 'Jueves',
    'V': 'Viernes',
    'S': 'Sábado',
    'D': 'Domingo'
  };
  return names[day];
}
