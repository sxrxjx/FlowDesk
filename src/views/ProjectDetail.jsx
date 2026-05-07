import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ChevronLeft, MoreVertical, CheckCircle2, PenTool, MessageSquare, Send, Calendar, DollarSign, Edit2, PlusCircle, StickyNote, X, Camera, Folder, Briefcase, Activity, User } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProject, getClient } = useStore();
  
  const [noteText, setNoteText] = useState('');
  const [noteImage, setNoteImage] = useState(null);
  const noteFileInputRef = useRef(null);

  const project = getProject(id);
  const client = project ? getClient(project.cliente_id) : null;

  const [showCameraMenu, setShowCameraMenu] = useState(false);
  const cameraInputRef = useRef(null);

  const handleAddNote = () => {
    if (noteText.trim() || noteImage) {
      useStore.getState().addBoardNote(project.id, noteText, noteImage);
      setNoteText('');
      setNoteImage(null);
      setShowCameraMenu(false);
    }
  };

  const handleNoteImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNoteImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!project) return <div className="p-8">Proyecto no encontrado</div>;

  const projectTasks = project.tasks || [
    { name: 'Investigación', completed: false },
    { name: 'Diseño de Concepto', completed: false },
    { name: 'Feedback del Cliente', completed: false },
    { name: 'Entrega Final', completed: false }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '0 20px', marginTop: '20px' }}>
        {/* Project Header Image with Overlaid Back Button */}
        <div 
          style={{ 
            background: `url(${project.imagen || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'}) center/cover`, 
            height: 260, 
            borderRadius: 24, 
            position: 'relative', 
            overflow: 'hidden',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '24px'
          }}
        >
          {/* Overlay Back Button */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '16px', zIndex: 10 }}>
            <button className="btn-icon" onClick={() => navigate(-1)} style={{ boxShadow: 'none', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: 'none' }}>
              <ChevronLeft size={24} color="white" />
            </button>
          </div>
          
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent 60%)' }}></div>
          
          <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
            <span className="badge" style={{ display: 'inline-block', marginBottom: '10px', background: 'var(--gradient-primary)', color: 'white', border: 'none', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.5px' }}>
              {project.categoria?.toUpperCase()}
            </span>
            <h1 style={{ fontSize: '2.2rem', lineHeight: '1.05', color: 'white', fontWeight: 800, margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{project.titulo}</h1>
            <p style={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: '0.9rem', 
              marginTop: '6px', 
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%'
            }}>
              {project.descripcion_corta || project.descripcion}
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px', marginTop: '16px' }}>
        {/* Client Link Card */}
        <div 
          onClick={() => navigate(`/clientes/${client?.id}`)}
          className="card flex-row gap-4" 
          style={{ padding: '16px', marginBottom: '24px', cursor: 'pointer', border: '1px solid #f1f5f9' }}
        >
          <img 
            src={client?.foto || "https://i.pravatar.cc/150?img=11"} 
            alt={client?.nombre} 
            style={{ width: 50, height: 50, borderRadius: '12px', objectFit: 'cover' }} 
          />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '2px' }}>CLIENTE</p>
            <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{client?.nombre}</h4>
          </div>
          <ChevronLeft size={20} color="var(--text-light)" style={{ transform: 'rotate(180deg)' }} />
        </div>

        {/* Collaborators Section */}
        <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
          <div className="flex-row gap-2" style={{ marginBottom: '16px' }}>
            <Briefcase size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem' }}>Colaboradores</h3>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {project.colaboradores && project.colaboradores.length > 0 ? (
              project.colaboradores.map((name, idx) => (
                <div key={idx} className="flex-row gap-2" style={{ 
                  background: 'var(--primary-light)', 
                  padding: '6px 12px', 
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 114, 32, 0.1)'
                }}>
                  <User size={14} color="var(--primary)" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{name}</span>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Proyecto gestionado individualmente.</p>
            )}
          </div>
        </div>
        
        {/* Process Checklist */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="flex-row justify-between" style={{ marginBottom: '20px' }}>
            <div className="flex-row gap-2">
              <Activity size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem' }}>Fases del Proyecto</h3>
            </div>
            <div className="flex-row gap-2">
               <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>{project.progreso}%</span>
               <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>completado</span>
            </div>
          </div>
          
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {projectTasks.map((task, idx) => {
              // Forced Translation Map
              const translations = {
                'Research': 'Investigación',
                'Concept Design': 'Diseño de Concepto',
                'Client Feedback': 'Feedback del Cliente',
                'Final Delivery': 'Entrega Final'
              };
              const displayName = translations[task.name] || task.name;

              const config = [
                { icon: <CheckCircle2 size={18} />, color: '#3b82f6', bg: '#eff6ff', grad: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }, // Azul
                { icon: <PenTool size={18} />, color: '#ef4444', bg: '#fef2f2', grad: 'linear-gradient(135deg, #ef4444, #f87171)' },      // Rojo
                { icon: <MessageSquare size={18} />, color: '#f59e0b', bg: '#fffbeb', grad: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }, // Amarillo
                { icon: <Send size={18} />, color: '#22c55e', bg: '#f0fdf4', grad: 'linear-gradient(135deg, #22c55e, #4ade80)' }          // Verde
              ];
              
              const item = config[idx];
              
              return (
                <div 
                  key={idx} 
                  onClick={() => useStore.getState().toggleProjectTask(project.id, idx)}
                  className="flex-row gap-4" 
                  style={{ 
                    padding: '16px', 
                    borderRadius: '16px', 
                    background: task.completed ? item.bg : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: `1.5px solid ${item.color}${task.completed ? '' : '33'}`,
                    marginBottom: '8px'
                  }}
                >
                  <div style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '8px', 
                    background: task.completed ? item.grad : 'transparent',
                    color: task.completed ? 'white' : item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: task.completed ? 'none' : `1px solid ${item.color}44`
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ 
                      display: 'block',
                      fontSize: '0.9rem', 
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      opacity: task.completed ? 0.6 : 1
                    }}>
                      {displayName}
                    </span>
                  </div>
                  <div style={{ 
                    width: 20, 
                    height: 20, 
                    borderRadius: '4px', 
                    border: `2px solid ${item.color}`,
                    background: task.completed ? item.grad : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}>
                    {task.completed && <CheckCircle2 size={14} color="white" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Details */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Detalles del Proyecto</h3>
          
          <div className="flex-row gap-4" style={{ marginBottom: '16px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={18} color="var(--primary)" />
            </div>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '2px' }}>Entrega</p>
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                {project.fecha_entrega 
                  ? new Date(project.fecha_entrega).toLocaleDateString('es-ES', { month: 'short', day: '2-digit', year: 'numeric' })
                  : 'Sin fecha definida'}
              </p>
            </div>
          </div>
          
          <div className="flex-row gap-4" style={{ marginBottom: '24px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={18} color="var(--primary)" />
            </div>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '2px' }}>Presupuesto</p>
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{project.presupuesto?.toLocaleString()}€</p>
            </div>
          </div>

          <div style={{ height: 1, background: '#f1f5f9', margin: '0 -20px 20px -20px' }}></div>
          
          <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>Descripción</p>
          <p style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap', lineHeight: '1.5', color: 'var(--text-primary)' }}>{project.descripcion}</p>
        </div>

        {/* Billing Status */}
        <div className="card" style={{ marginBottom: '24px', background: project.pagado ? '#f0fdf4' : '#fff1f2', border: `1px solid ${project.pagado ? '#bbf7d0' : '#fecdd3'}` }}>
          <div className="flex-row justify-between">
            <div className="flex-row gap-3">
              <div style={{ 
                width: 40, 
                height: 40, 
                borderRadius: '12px', 
                background: project.pagado ? '#16a34a' : '#e11d48', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white'
              }}>
                <DollarSign size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '2px', color: project.pagado ? '#166534' : '#9f1239' }}>
                  {project.pagado ? 'Proyecto Pagado' : 'Pendiente de Pago'}
                </h4>
                <p style={{ fontSize: '0.75rem', color: project.pagado ? '#15803d' : '#be123c' }}>
                  {project.pagado ? 'La cuantía se ha sumado a tus ingresos' : 'Marca como pagado para sumar a ingresos'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => useStore.getState().toggleProjectPayment(project.id)}
              style={{
                background: 'white',
                border: `1px solid ${project.pagado ? '#16a34a' : '#e11d48'}`,
                color: project.pagado ? '#16a34a' : '#e11d48',
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {project.pagado ? 'ANULAR' : 'PAGADO'}
            </button>
          </div>
        </div>

        <button 
          className="btn-primary" 
          onClick={() => navigate(`/proyectos/editar/${project.id}`)}
          style={{ marginBottom: '32px' }}
        >
          <Edit2 size={18} />
          Editar Proyecto
        </button>

        {/* Corporate Notes Section */}
        <div className="flex-row gap-2" style={{ marginBottom: '16px', marginTop: '40px' }}>
          <StickyNote size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Notas de Seguimiento</h3>
        </div>
        
        <div style={{ 
          background: '#ffffff',
          borderRadius: '24px', 
          padding: '24px',
          minHeight: '240px',
          border: '1.5px solid var(--primary)',
          marginBottom: '32px',
          boxShadow: '0 6px 20px rgba(233, 30, 99, 0.25)' // More contained pink shadow
        }}>
          {/* Corporate Add Note Input */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', paddingRight: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Añadir una nota profesional..." 
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  style={{ 
                    flex: 1,
                    padding: '14px 16px', 
                    border: 'none', 
                    outline: 'none', 
                    fontSize: '0.9rem', 
                    background: 'transparent'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddNote();
                  }}
                />
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setShowCameraMenu(!showCameraMenu)}
                    style={{ background: 'transparent', border: 'none', color: noteImage ? 'var(--primary)' : '#94a3b8', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center' }}
                  >
                    <Camera size={20} />
                  </button>

                  {showCameraMenu && (
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '50px', 
                      right: '-10px', 
                      background: 'white', 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
                      padding: '8px',
                      zIndex: 100,
                      width: '180px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <button 
                        onClick={() => { noteFileInputRef.current.click(); setShowCameraMenu(false); }}
                        style={{ width: '100%', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-primary)', borderRadius: '8px', textAlign: 'left' }}
                      >
                        <Folder size={16} color="var(--primary)" /> Subir desde dispositivo
                      </button>
                      <button 
                        onClick={() => { cameraInputRef.current.click(); setShowCameraMenu(false); }}
                        style={{ width: '100%', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-primary)', borderRadius: '8px', textAlign: 'left' }}
                      >
                        <Camera size={16} color="var(--secondary)" /> Abrir cámara
                      </button>
                    </div>
                  )}
                </div>

                <input 
                  type="file" 
                  ref={noteFileInputRef} 
                  style={{ display: 'none' }} 
                  accept="image/*"
                  onChange={handleNoteImageChange}
                />
                <input 
                  type="file" 
                  ref={cameraInputRef} 
                  style={{ display: 'none' }} 
                  accept="image/*"
                  capture="environment"
                  onChange={handleNoteImageChange}
                />
              </div>
              <button 
                onClick={handleAddNote}
                style={{ 
                  background: 'var(--gradient-primary)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  padding: '0 20px', 
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                AÑADIR
              </button>
            </div>

            {/* Image Preview */}
            {noteImage && (
              <div style={{ marginTop: '12px', position: 'relative', width: '80px', height: '80px' }}>
                <img src={noteImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--primary)' }} />
                <button 
                  onClick={() => setNoteImage(null)}
                  style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(project.notas_tablero || []).map((note, index) => (
              <div 
                key={note.id} 
                style={{ 
                  background: 'white', 
                  padding: '16px', 
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  position: 'relative',
                  borderLeft: `4px solid ${index % 2 === 0 ? 'var(--primary)' : 'var(--secondary)'}`,
                  display: 'flex',
                  flexDirection: 'column', // Changed to column to accommodate image
                  gap: '12px',
                  animation: 'fadeIn 0.3s ease-out'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>{note.text}</p>
                  </div>
                  <button 
                    onClick={() => useStore.getState().deleteBoardNote(project.id, note.id)}
                    style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {note.image && (
                  <img 
                    src={note.image} 
                    alt="Note content" 
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} 
                  />
                )}

                <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', alignSelf: 'flex-end' }}>
                  {new Date(note.id).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).toUpperCase()}
                </p>
              </div>
            ))}
            
            {(!project.notas_tablero || project.notas_tablero.length === 0) && (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0', fontSize: '0.85rem' }}>
                No hay notas registradas para este proyecto.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

const UserIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const ActivityIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);

const PaletteIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>
);
