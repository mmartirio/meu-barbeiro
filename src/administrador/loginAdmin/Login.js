import React from 'react';
import './Login.css'; 

function Administrador() {
  const whatsappNumber = '+5579991071656'; // Número do WhatsApp
  const message = encodeURIComponent('Estou entrando em contato para saber como posso utilizar o *Meu Barbeiro* no meu negócio');

  return (
    <>
      <div className="header">
        <h1 className='admin'>Painel Administrador</h1>
        <form className="form">
          <h1>Conecte-se</h1>
          
          <label htmlFor="email">E-mail</label>
          <input 
            type="email" 
            id="email" 
            placeholder="Digite seu e-mail"
            required 
          />

          <label htmlFor="password">Senha</label>
          <input 
            type="password" 
            id="password" 
            placeholder="Digite sua senha"
            required 
          />

          <div className="links">
            <div className='link'> 
              <a href="/recuperar-senha">Esqueceu a senha?</a>
              <a href={`https://wa.me/${whatsappNumber}?text=${message}`} target="_blank" rel="noopener noreferrer">Suporte técnico</a>
            </div>
            
            <button type="submit">Acessar</button> 
          </div>
        </form>
      </div>
    </>
  );
}

export default Administrador;
