import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirecionamento
import './Header.css'; // Estilos personalizados para o cabeçalho

const Header = () => {
  const navigate = useNavigate(); // Instancia o hook useNavigate
  const handleLogout = () => {
   
    navigate('/admin'); 
  };

  return (
    <header className="admin-header">
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
}

export default Header;
