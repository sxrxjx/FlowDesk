import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Shield, Heart } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'var(--gradient-primary)',
      color: 'white',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ 
          width: 80, 
          height: 80, 
          background: 'rgba(255,255,255,0.2)', 
          borderRadius: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: '24px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <Sparkles size={40} color="white" />
        </div>
        
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '16px', letterSpacing: '-2px', lineHeight: 1, color: 'white' }}>
          FlowDesk
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: 'white', marginBottom: '48px', maxWidth: '300px', lineHeight: 1.4 }}>
          Gestiona tu talento creativo con una herramienta a tu altura.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '300px' }}>
          <button 
            onClick={() => navigate('/registro')}
            className="btn-primary" 
            style={{ 
              background: 'white', 
              color: 'var(--primary)', 
              padding: '16px', 
              fontSize: '1rem',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            EMPEZAR AHORA <ArrowRight size={20} />
          </button>
          
          <button 
            onClick={() => navigate('/login')}
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white', 
              padding: '16px', 
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              backdropFilter: 'blur(5px)'
            }}
          >
            INICIAR SESIÓN
          </button>
        </div>
      </div>

      <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <Zap size={20} />
          <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Rápido</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <Shield size={20} />
          <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Seguro</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <Heart size={20} />
          <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Intuitivo</span>
        </div>
      </div>
    </div>
  );
}
