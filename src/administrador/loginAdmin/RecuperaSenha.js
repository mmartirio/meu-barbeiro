import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './RecuperaSenha.css'; // Importa os estilos

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Inicializa o hook useNavigate

  const handleBack = () => {
    navigate(-1); // Volta para a página anterior
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(''); // Limpa a mensagem anterior

    try {
      const response = await fetch('https://seu-backend.com/api/recuperar-senha', { // Substitua pela sua URL de API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Envia o e-mail no corpo da requisição
      });

      if (response.ok) {
        setMessage('Instruções de recuperação de senha enviadas para ' + email);
      } else {
        const data = await response.json();
        setMessage(data.message || 'Ocorreu um erro ao enviar as instruções.');
      }
    } catch (error) {
      setMessage('Erro de rede. Tente novamente mais tarde.');

      // Define um timeout para limpar a mensagem de erro após 4 segundos
      setTimeout(() => {
        setMessage('');
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recuperar-senha-container">
      <button onClick={handleBack} className="back-button">Voltar</button> {/* Botão Voltar */}
      <h1>Recuperar Senha</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="email">Digite seu e-mail cadastrado</label>
        <input 
          type="email" 
          id="email" 
          placeholder="E-mail" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Instruções'}
        </button>
        {message && <p>{message}</p>} {/* Exibe a mensagem de status */}
      </form>
    </div>
  );
};

export default RecuperarSenha;
