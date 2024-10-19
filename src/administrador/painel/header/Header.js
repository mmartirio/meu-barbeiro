import React from 'react';
import './Header.css'; // Estilos personalizados para o cabeçalho

const Header = () => {
  return (
    <header className="admin-header">
      <button onClick={() => alert('Logout')}>Logout</button>
    </header>
  );
}

export default Header;
