import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; 

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Navegação</h2>
      <ul>
        <li><Link to="/usuario">Usuários</Link></li>
        <li><Link to="/servicos">Serviços</Link></li>
        <li><Link to="/agenda">Agenda</Link></li>
        <li><Link to="/relatorios">Relatórios</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
