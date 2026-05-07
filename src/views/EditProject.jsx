import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store';
import { ChevronLeft, Camera, Search, X, Plus } from 'lucide-react';

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProject, updateProject, clients, collaborators } = useStore();
  
  const project = getProject(id);
  
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
  
  const [coverImage, setCoverImage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (project) {
      setFormData({
        titulo: project.titulo || '',
        cliente_id: project.cliente_id || '',
        categoria: project.categoria || 'Ilustración',
        fecha_entrega: project.fecha_entrega || '',
        presupuesto: project.presupuesto?.toString() || '',
        estado: project.estado || 'planificacion',
        descripcion: project.descripcion || '',
        descripcion_corta: project.descripcion_corta || '',
        colaboradores: project.colaboradores || []
      });
      setCoverImage(project.imagen || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop');
    }
  }, [project]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo) return;
    
    const projectToUpdate = {
      ...formData,
      imagen: coverImage,
      presupuesto: parseFloat(formData.presupuesto) || 0
    };

    await updateProject(id, projectToUpdate);
    navigate(`/proyectos/${id}`);
  };

  if (!project) return <div className="p-8">Proyecto no encontrado</div>;

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
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', zIndex: 10 }}>
            <button className="btn-icon" onClick={(e) => { e.stopPropagation(); navigate(-1); }} style={{ boxShadow: 'none', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: 'none' }}>
              <ChevronLeft size={24} color="white" />
            </button>
            <h2 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 700, margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Editar Proyecto</h2>
          </div>

          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1))' }} onClick={() => fileInputRef.current.click()}></div>
          <span style={{ color: 'white', position: 'relative', fontSize: '1.2rem', fontWeight: 700, zIndex: 1 }} onClick={() => fileInputRef.current.click()}>Insertar imagen</span>
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
              value={formData.titulo}
              onChange={handleChange}
              style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', background: '#f1f5f9', fontSize: '0.95rem', color: 'var(--text-primary)', outline: 'none' }}
              required
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
                style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', background: '#f1f5f9', fontSize: '0.95rem', color: 'var(--text-primary)', appearance: 'none', outline: 'none' }}
              >
                <option value="">Sin cliente / Particular</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Colaboradores */}
          <div style={{ marginBottom: '32px', marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#5c4848', marginBottom: '12px' }}>Actualizar Colaboradores</label>
            
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
                    border: formData.categoria === cat ? '1px solid #fbcfe8' : '1px solid #e2e8f0',
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
              <input 
                type="date" 
                name="fecha_entrega"
                value={formData.fecha_entrega}
                onChange={handleChange}
                style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: 'none', background: '#f1f5f9', fontSize: '0.9rem', color: 'var(--text-primary)', outline: 'none' }}
                required
              />
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

          {/* Notas del Proyecto */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#5c4848', marginBottom: '8px' }}>Descripción del Proyecto</label>
            <textarea 
              name="descripcion"
              rows="6" 
              value={formData.descripcion}
              onChange={handleChange}
              style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', background: '#f1f5f9', fontSize: '0.95rem', color: 'var(--text-primary)', outline: 'none', resize: 'none' }}
            ></textarea>
          </div>

          {/* Estado de Pago */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#5c4848', marginBottom: '12px' }}>Estado de Pago</label>
            <div 
              onClick={() => setFormData({ ...formData, pagado: !formData.pagado })}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                cursor: 'pointer',
                background: formData.pagado ? '#f0fdf4' : '#f1f5f9',
                padding: '12px 16px',
                borderRadius: '16px',
                border: `1px solid ${formData.pagado ? '#16a34a' : 'transparent'}`,
                transition: 'all 0.2s'
              }}
            >
              <div style={{ 
                width: 20, 
                height: 20, 
                borderRadius: '6px', 
                border: `2px solid ${formData.pagado ? '#16a34a' : '#cbd5e1'}`,
                background: formData.pagado ? '#16a34a' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {formData.pagado && <div style={{ width: 8, height: 8, background: 'white', borderRadius: '1px' }}></div>}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: formData.pagado ? '#166534' : 'var(--text-primary)' }}>
                {formData.pagado ? 'Proyecto Pagado' : 'Pendiente de cobro'}
              </span>
            </div>
          </div>

          <button type="submit" style={{ width: '100%', background: 'var(--gradient-primary)', color: 'white', border: 'none', borderRadius: '16px', padding: '18px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(241, 55, 195, 0.3)' }}>
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}
