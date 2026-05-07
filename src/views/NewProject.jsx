import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ChevronLeft, MoreVertical, Camera, Search, X, Plus } from 'lucide-react';

export default function NewProject() {
  const navigate = useNavigate();
  const { addProject, clients, collaborators } = useStore();
  
  const [formData, setFormData] = useState({
    titulo: '',
    cliente_id: '',
    categoria: 'Ilustración',
    fecha_entrega: '',
    presupuesto: '',
    estado: 'planificacion',
    descripcion: '',
    descripcion_corta: '',
    colaboradores: []
  });

  const [colabInput, setColabInput] = useState('');

  const addColaborador = () => {
    if (colabInput.trim() && !formData.colaboradores.includes(colabInput.trim())) {
      setFormData({ ...formData, colaboradores: [...formData.colaboradores, colabInput.trim()] });
      setColabInput('');
    }
  };

  const removeColaborador = (name) => {
    setFormData({ ...formData, colaboradores: formData.colaboradores.filter(c => c !== name) });
  };
  
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop');
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setCategoria = (cat) => setFormData({ ...formData, categoria: cat });
  const setEstado = (est) => setFormData({ ...formData, estado: est });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo) {
      alert("El título del proyecto es obligatorio");
      return;
    }
    
    // Default values and conversions
    const projectToSave = {
      ...formData,
      imagen: coverImage,
      progreso: formData.estado === 'en-progreso' ? 20 : (formData.estado === 'completado' ? 100 : 0),
      fecha_inicio: new Date().toISOString().split('T')[0],
      presupuesto: parseFloat(formData.presupuesto) || 0,
      urgencia: 'normal'
    };

    const newId = await addProject(projectToSave);
    navigate(`/proyectos/${newId}`);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ padding: '0 20px', marginTop: '20px' }}>
        {/* Header Image with Overlaid Buttons */}
        <div 
          style={{ 
            background: `url(${coverImage}) center/cover`, 
            height: 180, 
            borderRadius: 24, 
            position: 'relative', 
            overflow: 'hidden',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '20px',
            cursor: 'pointer'
          }}
        >
          {/* Overlay Buttons */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '16px', zIndex: 10 }}>
            <button className="btn-icon" onClick={(e) => { e.stopPropagation(); navigate(-1); }} style={{ boxShadow: 'none', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: 'none' }}>
              <ChevronLeft size={24} color="white" />
            </button>
          </div>

          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1))' }} onClick={() => fileInputRef.current.click()}></div>
          <h2 style={{ color: 'white', position: 'relative', fontSize: '1.4rem', fontWeight: 700, zIndex: 1 }} onClick={() => fileInputRef.current.click()}>Inspiring New Ideas</h2>
          <div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 2, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', padding: 8, borderRadius: '50%' }} onClick={() => fileInputRef.current.click()}>
             <Camera size={20} color="white" />
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Nombre del Proyecto */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#5c4848', marginBottom: '8px' }}>Nombre del Proyecto</label>
              <input 
                type="text" 
                name="titulo"
                placeholder="ej. Rediseño de Marca" 
                value={formData.titulo}
                onChange={handleChange}
                style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', background: '#f1f5f9', fontSize: '0.95rem', color: 'var(--text-primary)', outline: 'none' }}
              />
          </div>

          {/* Descripción Corta */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#5c4848', marginBottom: '8px' }}>Descripción Corta (máx. 9 palabras)</label>
            <input 
              type="text" 
              name="descripcion_corta"
              placeholder="Un slogan para la cabecera" 
              value={formData.descripcion_corta}
              onChange={handleChange}
              style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', background: '#f1f5f9', fontSize: '0.95rem', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>

          {/* Cliente */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#5c4848', marginBottom: '8px' }}>Cliente</label>
            <div style={{ position: 'relative' }}>
              <select 
                name="cliente_id"
                value={formData.cliente_id}
                onChange={handleChange}
                style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', background: '#f1f5f9', fontSize: '0.95rem', color: formData.cliente_id ? 'var(--text-primary)' : 'var(--text-secondary)', appearance: 'none', outline: 'none' }}
              >
                <option value="">Sin cliente / Particular</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>

          {/* Colaboradores */}
          <div style={{ marginBottom: '32px', marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#5c4848', marginBottom: '12px' }}>Añadir Colaboradores</label>
            
            {/* Manual Input */}
            <div className="flex-row gap-2" style={{ marginBottom: '16px' }}>
              <div className="input-field" style={{ margin: 0, background: '#f1f5f9', border: '1.5px solid transparent', flex: 1 }}>
                <Plus size={18} color="var(--text-light)" className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Nombre del colaborador..." 
                  value={colabInput}
                  onChange={(e) => setColabInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColaborador())}
                  style={{ background: 'transparent' }}
                />
              </div>
              <button 
                type="button"
                onClick={addColaborador}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', padding: '0 16px', height: '48px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Añadir
              </button>
            </div>

            {/* Selected Collaborators Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {formData.colaboradores.map((name, idx) => (
                <div key={idx} className="flex-row gap-2" style={{ 
                  background: 'white', 
                  padding: '6px 12px', 
                  borderRadius: '20px', 
                  border: '1px solid #e2e8f0',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{name}</span>
                  <button 
                    type="button"
                    onClick={() => removeColaborador(name)}
                    style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 2 }}
                  >
                    <X size={14} color="var(--text-secondary)" />
                  </button>
                </div>
              ))}
              {formData.colaboradores.length === 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontStyle: 'italic' }}>No hay colaboradores añadidos.</p>
              )}
            </div>
          </div>
          </div>

          {/* Categoría */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#5c4848', marginBottom: '12px' }}>Categoría</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Ilustración', 'Branding', 'Web', 'UX/UI'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoria(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: filterBorder(cat, formData.categoria),
                    background: formData.categoria === cat ? '#fce7f3' : 'transparent',
                    color: formData.categoria === cat ? '#be185d' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: formData.categoria === cat ? 600 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Fecha Entrega y Presupuesto */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#5c4848', marginBottom: '8px' }}>Fecha Entrega</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="date" 
                  name="fecha_entrega"
                  value={formData.fecha_entrega}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: 'none', background: '#f1f5f9', fontSize: '0.9rem', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#5c4848', marginBottom: '8px' }}>Presupuesto</label>
              <input 
                type="number" 
                name="presupuesto"
                placeholder="0.00€"
                value={formData.presupuesto}
                onChange={handleChange}
                style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: 'none', background: '#f1f5f9', fontSize: '0.9rem', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
          </div>

          {/* Estado Inicial */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#5c4848', marginBottom: '8px' }}>Estado Inicial</label>
            <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '24px', padding: '4px' }}>
              <SegmentButton label="Planificación" value="planificacion" current={formData.estado} onClick={() => setEstado('planificacion')} />
              <SegmentButton label="En Progreso" value="en-progreso" current={formData.estado} onClick={() => setEstado('en-progreso')} />
              <SegmentButton label="Revisión" value="revision" current={formData.estado} onClick={() => setEstado('revision')} />
            </div>
          </div>

          {/* Notas del Proyecto */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#5c4848', marginBottom: '8px' }}>Notas del Proyecto</label>
            <textarea 
              name="descripcion"
              rows="4" 
              placeholder="Describe brevemente el alcance del proyecto..."
              value={formData.descripcion}
              onChange={handleChange}
              style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', background: '#f1f5f9', fontSize: '0.95rem', color: 'var(--text-primary)', outline: 'none', resize: 'none' }}
            ></textarea>
          </div>

          <button type="submit" style={{ width: '100%', background: '#a855f7', color: 'white', border: 'none', borderRadius: '16px', padding: '18px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)' }}>
            Guardar Proyecto
          </button>
        </form>
      </div>
    </div>
  );
}

// Helpers
function filterBorder(cat, current) {
  if (current === cat) return '1px solid #fbcfe8';
  return '1px solid #e2e8f0';
}

function SegmentButton({ label, value, current, onClick }) {
  const active = current === value;
  return (
    <div 
      onClick={onClick}
      style={{
        flex: 1,
        textAlign: 'center',
        padding: '10px 0',
        borderRadius: '20px',
        background: active ? 'white' : 'transparent',
        color: active ? '#be185d' : 'var(--text-secondary)',
        fontSize: '0.7rem',
        fontWeight: active ? 700 : 500,
        boxShadow: active ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
    >
      {label}
    </div>
  );
}
