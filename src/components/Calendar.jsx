import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  parseISO 
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);
  const { projects } = useStore();

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="flex-row justify-between" style={{ marginBottom: '20px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </span>
        <div className="flex-row gap-4">
          <ChevronLeft 
            size={20} 
            style={{ fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }} 
            onClick={prevMonth}
          />
          <ChevronRight 
            size={20} 
            style={{ fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }} 
            onClick={nextMonth}
          />
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '12px' }}>
        {days.map(day => (
          <div key={day} style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'd');
        const cloneDay = day;
        
        // Find projects for this day (deadlines)
        const dayProjects = projects.filter(p => p.fecha_entrega && isSameDay(parseISO(p.fecha_entrega), cloneDay));
        const hasProjects = dayProjects.length > 0;

        days.push(
          <div
            key={day.toString()}
            className={`calendar-day ${!isSameMonth(day, monthStart) ? 'disabled' : ''} ${isSameDay(day, new Date()) ? 'today' : ''}`}
            style={{ 
              padding: '6px 0', 
              position: 'relative',
              cursor: hasProjects ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              margin: 'auto',
              fontSize: '0.8rem',
              color: !isSameMonth(day, monthStart) ? '#d1d5db' : 'inherit',
              background: isSameDay(day, new Date()) ? 'var(--primary-light)' : 'transparent',
              fontWeight: isSameDay(day, new Date()) ? '600' : '400'
            }}
            onMouseEnter={() => hasProjects && setHoveredDate(cloneDay)}
            onMouseLeave={() => setHoveredDate(null)}
          >
            <span>{formattedDate}</span>
            {hasProjects && (
              <div style={{ 
                position: 'absolute', 
                bottom: 2, 
                left: '50%', 
                transform: 'translateX(-50%)', 
                width: 4, 
                height: 4, 
                borderRadius: '50%', 
                background: 'var(--secondary)' 
              }}></div>
            )}
            
            {/* Tooltip */}
            {hoveredDate && isSameDay(day, hoveredDate) && hasProjects && (
              <div className="calendar-tooltip" style={{
                position: 'absolute',
                bottom: '120%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'white',
                border: '1px solid #eee',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 100,
                width: '180px',
                textAlign: 'left',
                pointerEvents: 'none'
              }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Entregas para hoy:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {dayProjects.map(p => (
                    <div key={p.id}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.titulo}</p>
                      <span className={`badge ${p.urgencia}`} style={{ fontSize: '0.6rem', padding: '2px 6px' }}>{p.urgencia}</span>
                    </div>
                  ))}
                </div>
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid white'
                }}></div>
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="calendar-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{rows}</div>;
  };

  return (
    <div className="card">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
