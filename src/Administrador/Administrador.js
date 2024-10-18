import React from 'react';
import './Administrador.css'; 

function Administrador() {
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
          <a href="/suporte">Suporte técnico</a>
          </div>
           
            <button type="submit">Acessar</button> 
          </div>
        </form>
      </div>
    </>
  );
}

export default Administrador;
