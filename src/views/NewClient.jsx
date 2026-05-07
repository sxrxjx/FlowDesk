import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ChevronLeft, Camera, User, Briefcase, Phone, Mail, FileText, Save } from 'lucide-react';

export default function NewClient() {
  const navigate = useNavigate();
  const { addClient } = useStore();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    especialidad: '',
    telefono: '',
    email: '',
    notas: '',
    foto: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70)
  });

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
    
    addClient(formData);
    navigate('/clientes');
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '40px', minHeight: '100vh', background: '#f7f8fa' }}>
      {/* Top Bar */}
      <div className="flex-row" style={{ marginBottom: '24px' }}>
        <button className="btn-icon" onClick={() => navigate(-1)} style={{ boxShadow: 'none', background: 'transparent' }}>
          <ChevronLeft size={24} color="var(--primary)" />
        </button>
        <h1 style={{ fontSize: '1.2rem', marginLeft: '16px' }}>Nuevo Cliente</h1>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{ background: '#fce7f3', color: '#be185d', padding: '6px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px' }}>
          GESTIÓN DE CONTACTOS
        </span>
        <h2 style={{ marginTop: '16px', marginBottom: '8px', fontSize: '1.1rem' }}>FlowDesk</h2>
        <p style={{ fontSize: '0.85rem', padding: '0 20px' }}>
          Registra los detalles de tu nuevo colaborador o cliente para mantener tu flujo creativo organizado.
        </p>
      </div>

      <div className="card" style={{ padding: '32px 20px', borderRadius: '24px' }}>
        <form onSubmit={handleSubmit}>
          
          {/* Photo Upload */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div 
              onClick={() => fileInputRef.current.click()}
              style={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                border: '2px solid #d8b4fe', 
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
                background: 'rgba(0,0,0,0.1)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Camera size={24} color="white" />
              </div>
              <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'white', borderRadius: '50%', padding: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <EditIcon size={12} color="#a855f7" />
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
          <p style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '-20px', marginBottom: '24px' }}>FOTO DEL CLIENTE</p>

          <div className="input-group">
            <label className="input-label">NOMBRE COMPLETO</label>
            <div className="input-field">
              <User size={18} className="input-icon" />
              <input type="text" name="nombre" placeholder="Ej. Alejandra Rossi" value={formData.nombre} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">ESPECIALIDAD / INDUSTRIA</label>
            <div className="input-field">
              <Briefcase size={18} className="input-icon" />
              <input type="text" name="especialidad" placeholder="Diseño Gráfico" value={formData.especialidad} onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">TELÉFONO</label>
            <div className="input-field">
              <Phone size={18} className="input-icon" />
              <input type="tel" name="telefono" placeholder="+34 600 000 000" value={formData.telefono} onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">CORREO ELECTRÓNICO</label>
            <div className="input-field">
              <Mail size={18} className="input-icon" />
              <input type="email" name="email" placeholder="hola@artisan.com" value={formData.email} onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">NOTAS O DETALLES DEL PROYECTO</label>
            <div className="input-field" style={{ alignItems: 'flex-start' }}>
              <FileText size={18} className="input-icon" style={{ marginTop: '2px' }} />
              <textarea name="notas" rows="3" placeholder="Describe brevemente las metas creativas o requerimientos específicos del cliente..." value={formData.notas} onChange={handleChange}></textarea>
            </div>
          </div>

          <div style={{ background: 'url(https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop) center/cover', padding: '24px', borderRadius: '20px', marginTop: '32px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-primary)', opacity: 0.8 }}></div>
            <p style={{ position: 'relative', color: 'white', fontStyle: 'italic', fontSize: '0.9rem', fontWeight: 500 }}>
              Construye relaciones, crea futuro.
            </p>
          </div>

          <button type="submit" className="btn-primary">
            <Save size={20} />
            Guardar Cliente
          </button>
        </form>
      </div>
    </div>
  );
}

const EditIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);
