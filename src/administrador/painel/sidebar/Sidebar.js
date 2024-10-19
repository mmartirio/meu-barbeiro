import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Estilos personalizados para a barra lateral

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Navegação</h2>
      <ul>
        <li><Link to="/admin/usuarios">Usuários</Link></li>
        <li><Link to="/admin/servicos">Serviços</Link></li>
        <li><Link to="/admin/agenda">Agenda</Link></li>
        <li><Link to="/admin/relatorios">Relatórios</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
