import React, { useState } from 'react';
import { useStore } from '../store';
import { Mail, Lock, LogIn, Sparkles, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Login() {
  const { login } = useStore();
  const [email, setEmail] = useState('sara@gmail.com');
  const [password, setPassword] = useState('sabrina');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      padding: '40px',
      background: 'var(--gradient-primary)',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ 
          width: 64, 
          height: 64, 
          background: 'rgba(255,255,255,0.2)', 
          borderRadius: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 20px',
          backdropFilter: 'blur(10px)'
        }}>
          <Sparkles size={32} color="white" />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px', color: 'white' }}>FlowDesk</h1>
        <p style={{ opacity: 0.9, fontSize: '1.1rem', color: 'white' }}>Gestiona tu flujo creativo con estilo</p>
      </div>

      <div className="card" style={{ background: 'white', color: 'var(--text-primary)', padding: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '24px', textAlign: 'center' }}>Bienvenida de nuevo</h2>
        
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
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-field">
              <div className="input-icon"><Mail size={18} /></div>
              <input 
                type="email" 
                placeholder="tu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ textAlign: 'right', marginTop: '-8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>
              ¿Olvidaste tu contraseña?
            </span>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '12px' }}>
            <LogIn size={20} />
            ENTRAR AHORA
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          ¿No tienes una cuenta? <Link to="/registro" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Regístrate</Link>
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
