import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Sparkles, ChevronLeft } from 'lucide-react';

export default function Register() {
  const { register } = useStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setLoading(true);
    const result = await register(formData.email, formData.password, formData.nombre);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      padding: '40px',
      background: 'var(--gradient-primary)',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ 
          width: 56, 
          height: 56, 
          background: 'rgba(255,255,255,0.2)', 
          borderRadius: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 16px',
          backdropFilter: 'blur(10px)'
        }}>
          <Sparkles size={28} color="white" />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '4px', color: 'white' }}>FlowDesk</h1>
        <p style={{ opacity: 0.9, fontSize: '1rem', color: 'white' }}>Crea tu cuenta profesional</p>
      </div>

      <div className="card" style={{ background: 'white', color: 'var(--text-primary)', padding: '32px' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '24px', textAlign: 'center', fontWeight: 700 }}>Únete a la comunidad</h2>
        
        {error && (
          <div style={{ 
            background: '#fef2f2', 
            color: 'var(--danger)', 
            padding: '12px', 
            borderRadius: '12px', 
            fontSize: '0.8rem', 
            fontWeight: 600, 
            marginBottom: '20px',
            textAlign: 'center',
            border: '1px solid #fee2e2'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-group">
            <label className="input-label">Nombre Completo</label>
            <div className="input-field">
              <div className="input-icon"><User size={18} /></div>
              <input 
                type="text" 
                placeholder="Ej. Sara Esparza" 
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-field">
              <div className="input-icon"><Mail size={18} /></div>
              <input 
                type="email" 
                placeholder="tu@email.com" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Contraseña</label>
            <div className="input-field">
              <div className="input-icon"><Lock size={18} /></div>
              <input 
                type="password" 
                placeholder="Mínimo 8 caracteres" 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Confirmar Contraseña</label>
            <div className="input-field">
              <div className="input-icon"><Lock size={18} /></div>
              <input 
                type="password" 
                placeholder="Repite tu contraseña" 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '12px' }}>
            <UserPlus size={20} />
            CREAR CUENTA
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Inicia sesión</Link>
        </div>
      </div>
      
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <Link to="/" className="flex-row justify-center gap-1" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', fontSize: '0.85rem' }}>
          <ChevronLeft size={16} />
          Volver a inicio
        </Link>
      </div>
    </div>
  );
}
