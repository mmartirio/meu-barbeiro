
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, logo } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin'); // ou '/login' conforme sua rota de login
  };

  return (
    <header className="main-header">
      <div className="tenant-info">
        {logo && <img src={logo} alt="Logo do tenant" className="tenant-logo" style={{ height: 40, marginRight: 16, borderRadius: 6 }} />}
        <span>Barbearia: {user?.tenantId || 'N/A'}</span>
        <span>Usuário: {user?.email || 'Visitante'}</span>
      </div>
      <div className="actions">
        <span className="theme-name">Tema: {theme.name}</span>
        {user && <button onClick={handleLogout}>Sair</button>}
      </div>
    </header>
  );
}
