
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FiSettings, FiImage } from 'react-icons/fi';
import ThemeModal from '../../../components/ThemeModal';
import { AuthContext } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <div className="sidebar">
      <h2>{t('sidebar.title', 'Navegação')}</h2>
      <ul>
        <li><Link to="/usuario">{t('sidebar.users', 'Usuários')}</Link></li>
        <li><Link to="/servicos">{t('sidebar.services', 'Serviços')}</Link></li>
        <li><Link to="/agenda">{t('sidebar.schedule', 'Agenda')}</Link></li>
        <li><Link to="/relatorios">{t('sidebar.reports', 'Relatórios')}</Link></li>
      </ul>
      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button className="sidebar-btn" onClick={() => setThemeModalOpen(true)}>
          <FiSettings style={{ marginRight: 6 }} /> {t('sidebar.theme', 'Tema & Plano de Fundo')}
        </button>
      </div>
      <ThemeModal isOpen={themeModalOpen} onClose={() => setThemeModalOpen(false)} />
    </div>
  );
}

// Componente removido após refatoração do layout. Agora a navegação está centralizada em AdminDashboard.js
