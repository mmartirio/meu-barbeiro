import React, { useState, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { FiSun, FiMoon, FiImage, FiTrash2 } from 'react-icons/fi';
import './ThemeModal.css';

export default function ThemeModal({ isOpen, onClose }) {
  const { theme, changeTheme, backgroundImage, changeBackground } = useTheme();
  const { t } = useTranslation();
  const [bgOpacity, setBgOpacity] = useState(0.5);
  const fileInputRef = useRef();

  if (!isOpen) return null;

  return (
    <div className="theme-modal-overlay" onClick={onClose}>
      <div className="theme-modal" onClick={e => e.stopPropagation()}>
        <button className="theme-modal-close" onClick={onClose} aria-label={t('theme.close') || 'Fechar'}>×</button>
        <h2 style={{margin: 0, color: 'var(--primary-color, #3B82F6)', fontWeight: 700, fontSize: '1.3rem', letterSpacing: 0.5}}>{t('theme.title') || 'Personalização'}</h2>
        <div className="theme-options">
          <button 
            className={`theme-btn${theme.name === 'light' ? ' active' : ''}`}
            onClick={() => changeTheme('light')}
            aria-label={t('theme.lightAria') || 'Tema claro'}
          >
            <FiSun /> {t('theme.light') || 'Claro'}
          </button>
          <button 
            className={`theme-btn${theme.name === 'dark' ? ' active' : ''}`}
            onClick={() => changeTheme('dark')}
            aria-label={t('theme.darkAria') || 'Tema escuro'}
          >
            <FiMoon /> {t('theme.dark') || 'Escuro'}
          </button>
        </div>
        <div className="theme-bg-section">
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={e => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = ev => changeBackground(ev.target.result);
                reader.readAsDataURL(file);
              }
            }}
          />
          <button className="theme-btn" onClick={() => fileInputRef.current?.click()} aria-label={t('theme.selectBgAria') || 'Selecionar plano de fundo'}>
            <FiImage /> {t('theme.bgButton') || 'Plano de Fundo'}
          </button>
          {backgroundImage && (
            <>
              <div style={{margin: '10px 0', textAlign: 'center'}}>
                <img src={backgroundImage} alt={t('theme.bgPreviewAlt') || 'Preview do plano de fundo'} style={{maxWidth: '100%', maxHeight: 120, borderRadius: 8, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)', border: '1px solid #eee', background: '#fafafa'}} />
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{t('theme.preview') || 'Pré-visualização'}</div>
              </div>
              <div className="opacity-control">
                <label>{t('theme.opacity') || 'Opacidade:'}</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.05" 
                  value={bgOpacity}
                  onChange={e => setBgOpacity(Number(e.target.value))} 
                />
                <span className="opacity-value">{Math.round(bgOpacity*100)}%</span>
              </div>
              <button className="theme-btn danger" onClick={() => changeBackground('')} aria-label={t('theme.removeBgAria') || 'Remover plano de fundo'}><FiTrash2 /> {t('theme.removeBg') || 'Remover Fundo'}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
