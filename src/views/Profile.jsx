import React, { useState } from 'react';
import { useStore } from '../store';
import { User, Mail, Lock, Camera, Save, LogOut, ChevronRight, Globe, Bell } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile, logout, changePassword } = useStore();
  const [formData, setFormData] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleSave = async () => {
    if (passwordMode) {
      if (newPassword.length < 4) {
        alert('La contraseña debe tener al menos 4 caracteres');
        return;
      }
      await changePassword(newPassword);
      setNewPassword('');
    } else {
      await updateProfile(formData);
    }
    setIsEditing(false);
    setPasswordMode(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        updateProfile({ foto: base64String });
        setFormData(prev => ({ ...prev, foto: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '100px' }}>
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 16px' }}>
          <img 
            src={user.foto} 
            alt="Profile" 
            style={{ width: '100%', height: '100%', borderRadius: '50%', border: '4px solid white', boxShadow: 'var(--shadow-md)', objectFit: 'cover' }} 
          />
          <label style={{ 
            position: 'absolute', 
            bottom: 0, 
            right: 0, 
            background: 'var(--primary)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '50%', 
            width: 32, 
            height: 32, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer'
          }}>
            <Camera size={16} />
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handleImageUpload}
            />
          </label>
        </div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{user.nombre}</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user.email}</p>
      </header>

      {/* Profile Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Personal Info */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="flex-row justify-between" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem' }}>Información Personal</h3>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {isEditing ? 'CANCELAR' : 'EDITAR'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="input-group">
              <label className="input-label">Nombre Completo</label>
              <div className="input-field">
                <div className="input-icon"><User size={18} /></div>
                <input 
                  type="text" 
                  value={formData.nombre} 
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Email</label>
              <div className="input-field">
                <div className="input-icon"><Mail size={18} /></div>
                <input 
                  type="email" 
                  value={formData.email} 
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Biografía</label>
              <div className="input-field">
                <textarea 
                  rows="3"
                  value={formData.biografia} 
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
                  style={{ border: 'none', background: 'transparent', width: '100%', resize: 'none', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <button className="btn-primary" style={{ marginTop: '24px' }} onClick={handleSave}>
              <Save size={20} />
              GUARDAR CAMBIOS
            </button>
          )}
        </div>

        {/* Security / Password */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="flex-row justify-between" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem' }}>Seguridad</h3>
            {!passwordMode && (
              <button 
                onClick={() => setPasswordMode(true)}
                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                CAMBIAR CONTRASEÑA
              </button>
            )}
          </div>

          {passwordMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="input-group">
                <label className="input-label">Contraseña Actual</label>
                <div className="input-field">
                  <div className="input-icon"><Lock size={18} /></div>
                  <input type="password" placeholder="••••••••" />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Nueva Contraseña</label>
                <div className="input-field">
                  <div className="input-icon"><Lock size={18} /></div>
                  <input 
                    type="password" 
                    placeholder="Mínimo 4 caracteres" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-primary" onClick={handleSave}>CONFIRMAR</button>
                <button 
                  style={{ flex: 1, background: '#f1f5f9', border: 'none', borderRadius: 'var(--radius-full)', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => setPasswordMode(false)}
                >
                  CANCELAR
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-row justify-between" style={{ opacity: 0.6 }}>
              <div className="flex-row gap-3">
                <Lock size={18} />
                <span style={{ fontSize: '0.9rem' }}>Último cambio: Hace 3 meses</span>
              </div>
              <ChevronRight size={18} />
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>Preferencias</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="flex-row justify-between">
              <div className="flex-row gap-3">
                <Bell size={18} color="var(--primary)" />
                <span style={{ fontSize: '0.9rem' }}>Notificaciones Push</span>
              </div>
              <input 
                type="checkbox" 
                checked={formData.notificaciones}
                onChange={(e) => setFormData({ ...formData, notificaciones: e.target.checked })}
              />
            </div>

            <div className="flex-row justify-between">
              <div className="flex-row gap-3">
                <Globe size={18} color="var(--primary)" />
                <span style={{ fontSize: '0.9rem' }}>Idioma</span>
              </div>
              <select 
                value={formData.idioma}
                onChange={(e) => setFormData({ ...formData, idioma: e.target.value })}
                style={{ border: 'none', background: '#f1f5f9', padding: '4px 8px', borderRadius: '8px' }}
              >
                <option>Español</option>
                <option>English</option>
                <option>Français</option>
              </select>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={logout}
          className="flex-row justify-center gap-2" 
          style={{ 
            width: '100%',
            marginTop: '16px', 
            padding: '16px', 
            background: 'white', 
            border: '1px solid #fee2e2', 
            borderRadius: 'var(--radius-lg)', 
            color: 'var(--danger)',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <LogOut size={20} />
          CERRAR SESIÓN
        </button>

      </div>
    </div>
  );
}
