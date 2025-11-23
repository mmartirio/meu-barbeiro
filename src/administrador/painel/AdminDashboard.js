import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { useTranslation } from 'react-i18next';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import SettingsModal from '../../components/SettingsModal';

// Ícones
import { 
  FiUsers, 
  FiCalendar, 
  FiDollarSign, 
  FiScissors,
  FiSun,
  FiMoon,
  FiTrendingUp,
  FiSettings,
  FiLogOut // Ícone de sair adicionado
} from 'react-icons/fi';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend
);

function AdminDashboard() {
  const { t } = useTranslation();
  const { theme, changeTheme, backgroundImage, changeBackground, logo } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [bgOpacity, setBgOpacity] = useState(0.5);
  const fileInputRef = useRef();
  const [chartData, setChartData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [cardsData, setCardsData] = useState([
    {
      key: 'clients',
      value: 0,
      icon: <FiUsers size={24} />,
      trend: 0,
      color: '#3B82F6',
    },
    {
      key: 'appointments',
      value: 0,
      icon: <FiCalendar size={24} />,
      trend: 0,
      color: '#10B981',
    },
    {
      key: 'revenue',
      value: 'R$ 0',
      icon: <FiDollarSign size={24} />,
      trend: 0,
      color: '#F59E0B',
    },
    {
      key: 'services',
      value: 0,
      icon: <FiScissors size={24} />,
      trend: 0,
      color: '#6366F1',
    },
  ]);

  // Controle de exibição do ThemeSwitcher
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);
  // Controle de exibição do SettingsModal
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (backgroundImage) {
      document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,${1-bgOpacity}), rgba(0,0,0,${1-bgOpacity})), url(${backgroundImage})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      document.body.style.backgroundImage = 'none';
      document.body.style.backgroundColor = theme.background;
    }
  }, [backgroundImage, bgOpacity, theme]);

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
      navigate('/admin');
    }
  };

  return (
    <div className={`admin-dashboard ${theme.name}`}>
      {/* Sidebar fixa à esquerda */}
      <nav className="sidebar-unified">
        <div>
          <div className="sidebar-logo" style={{textAlign: 'center', marginBottom: '0.7rem'}}>
            <img
              src={logo || require('../../assets/logo-meu-barbeiro.png')}
              alt="Logo do sistema"
              style={{maxWidth: '120px', maxHeight: '80px', objectFit: 'contain', display: 'block', margin: '0 auto'}}
            />
          </div>
          <h2>{t('sidebar.title', 'Meu Barbeiro')}</h2>
          {user && user.name && (
            <div className="sidebar-welcome">
              <span style={{display: 'block', fontWeight: 400}}>Bem-vindo,</span>
              <span style={{display: 'block', fontWeight: 600, fontSize: '1.08em'}}>{user.name}</span>
            </div>
          )}
          <ul>
            <li><a href="/usuario">{t('sidebar.users', 'Usuários')}</a></li>
            <li><a href="/servicos">{t('sidebar.services', 'Serviços')}</a></li>
            <li><a href="/agenda">{t('sidebar.schedule', 'Agenda')}</a></li>
            <li><a href="/relatorios">{t('sidebar.reports', 'Relatórios')}</a></li>
          </ul>
        </div>
        <div className="sidebar-buttons">
          <button
            className="sidebar-btn"
            onClick={() => setShowSettings(true)}
            title={t('sidebar.settings', 'Configurações')}
          >
            <FiSettings /> {t('sidebar.settings', 'Configurações')}
          </button>
          <button
            className="sidebar-btn logout"
            onClick={handleLogout}
          >
            <FiLogOut /> {t('sidebar.logout', 'Sair')}
          </button>
        </div>
      </nav>
      
      {/* Conteúdo principal com header embutido */}
      <main className="main-content-unified">
        {showThemeSwitcher && <ThemeSwitcher />}
        {showSettings && <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />}
        <header className="main-header-unified">
          <h1>{t('dashboard.title', 'Painel do Administrador')}</h1>
        </header>
        
        <section className="dashboard-section">
          <h2 className="section-title">{t('dashboard.overview', 'Visão Geral')}</h2>
          <div className="dashboard-cards">
            {cardsData.map((card, index) => (
              <div 
                className="dashboard-card" 
                key={card.key}
                style={{ '--card-color': card.color }}
              >
                <div className="card-header">
                  <div className="card-icon" style={{ backgroundColor: `${card.color}20` }}>
                    {card.icon}
                  </div>
                  <div className="card-trend">
                    <FiTrendingUp 
                      className={card.trend >= 0 ? 'trend-up' : 'trend-down'} 
                      size={16} 
                    />
                    <span className={card.trend >= 0 ? 'trend-up' : 'trend-down'}>
                      {card.trend >= 0 ? '+' : ''}{card.trend}%
                    </span>
                  </div>
                </div>
                <div className="card-content">
                  <span className="card-value">{card.value}</span>
                  <span className="card-label">{t(`dashboard.${card.key}`, card.key)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="dashboard-charts">
          <div className="chart-container">
            <div className="chart-header">
              <h3 className="chart-title">{t('dashboard.servicesPerformed', 'Serviços Realizados')}</h3>
              <button className="chart-action">
                <FiSettings size={16} />
              </button>
            </div>
            <div className="chart-content">
              {!chartData ? (
                <div style={{ width: '100%', textAlign: 'center', color: '#888', padding: '2rem 0' }}>
                  {t('dashboard.loading', 'Carregando dados...')}
                </div>
              ) : (
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { 
                        position: 'top',
                        labels: {
                          usePointStyle: true,
                        }
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: theme.border,
                        }
                      },
                      x: {
                        grid: {
                          display: false,
                        }
                      }
                    },
                  }}
                />
              )}
            </div>
          </div>
          
          <div className="chart-container">
            <div className="chart-header">
              <h3 className="chart-title">{t('dashboard.monthlyRevenue', 'Faturamento Mensal')}</h3>
              <button className="chart-action">
                <FiSettings size={16} />
              </button>
            </div>
            <div className="chart-content">
              {!revenueData ? (
                <div style={{ width: '100%', textAlign: 'center', color: '#888', padding: '2rem 0' }}>
                  {t('dashboard.loading', 'Carregando dados...')}
                </div>
              ) : (
                <Bar
                  data={revenueData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { 
                        position: 'top',
                        labels: {
                          usePointStyle: true,
                        }
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: theme.border,
                        }
                      },
                      x: {
                        grid: {
                          display: false,
                        }
                      }
                    },
                  }}
                />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
