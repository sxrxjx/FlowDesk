import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store';
import { ChevronLeft, Camera, User, Briefcase, Phone, Mail, FileText, Save } from 'lucide-react';

export default function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getClient, updateClient } = useStore();
  const fileInputRef = useRef(null);
  
  const client = getClient(id);
  
  const [formData, setFormData] = useState({
    nombre: '',
    especialidad: '',
    telefono: '',
    email: '',
    notas: '',
    foto: ''
  });

  useEffect(() => {
    if (client) {
      setFormData({
        nombre: client.nombre || '',
        especialidad: client.especialidad || '',
        telefono: client.telefono || '',
        email: client.email || '',
        notas: client.notas || '',
        foto: client.foto || ''
      });
    }
  }, [client]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre) return;
    
    updateClient(id, formData);
    navigate(`/clientes/${id}`);
  };

  if (!client) return <div className="p-8">Cliente no encontrado</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '40px', minHeight: '100vh', background: '#f7f8fa' }}>
      {/* Top Bar */}
      <div className="flex-row" style={{ marginBottom: '24px', alignItems: 'center' }}>
        <button className="btn-icon" onClick={() => navigate(-1)} style={{ boxShadow: 'none', background: 'transparent' }}>
          <ChevronLeft size={24} color="var(--primary)" />
        </button>
        <h1 style={{ fontSize: '1.2rem', marginLeft: '16px', fontWeight: 700 }}>Editar Cliente</h1>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px' }}>
          ACTUALIZAR DATOS
        </span>
        <h2 style={{ marginTop: '16px', marginBottom: '8px', fontSize: '1.4rem' }}>{formData.nombre}</h2>
        <p style={{ fontSize: '0.85rem', padding: '0 20px', color: 'var(--text-secondary)' }}>
          Mantén la información de tus contactos actualizada para optimizar tu flujo de trabajo creativo.
        </p>
      </div>

      <div className="card" style={{ padding: '32px 20px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
        <form onSubmit={handleSubmit}>
          
          {/* Photo Upload */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div 
              onClick={() => fileInputRef.current.click()}
              style={{ 
                width: 100, 
                height: 100, 
                borderRadius: '50%', 
                border: '3px solid white',
                boxShadow: '0 0 0 2px var(--primary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                position: 'relative',
                background: `url(${formData.foto}) center/cover`,
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'rgba(0,0,0,0.2)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Camera size={24} color="white" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*" 
                onChange={handlePhotoChange} 
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">NOMBRE COMPLETO</label>
            <div className="input-field">
              <User size={18} className="input-icon" />
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">ESPECIALIDAD / INDUSTRIA</label>
            <div className="input-field">
              <Briefcase size={18} className="input-icon" />
              <input type="text" name="especialidad" value={formData.especialidad} onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">TELÉFONO</label>
            <div className="input-field">
              <Phone size={18} className="input-icon" />
              <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">CORREO ELECTRÓNICO</label>
            <div className="input-field">
              <Mail size={18} className="input-icon" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">NOTAS Y DETALLES</label>
            <div className="input-field" style={{ alignItems: 'flex-start' }}>
              <FileText size={18} className="input-icon" style={{ marginTop: '2px' }} />
              <textarea name="notas" rows="4" value={formData.notas} onChange={handleChange}></textarea>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>
            <Save size={20} />
            Actualizar Datos
          </button>
        </form>
      </div>
    </div>
  );
}
