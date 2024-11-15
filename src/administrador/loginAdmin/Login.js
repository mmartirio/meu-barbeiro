import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Administrador() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const whatsappNumber = '+5579991071656'; // Número do WhatsApp
    const message = encodeURIComponent('Estou entrando em contato para saber como posso utilizar o *Meu Barbeiro* no meu negócio');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const credentials = { email, password };

        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            // Verificar se a resposta foi bem-sucedida
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro ao autenticar:', errorData);
                throw new Error(errorData.message || 'Erro ao autenticar');
            }

            const data = await response.json();
            console.log('Login realizado com sucesso:', data);
            navigate('/dashboard'); // Redirecionar para o dashboard após o login bem-sucedido
        } catch (error) {
            console.error("Erro ao autenticar:", error);
            alert(`Erro: ${error.message}`); // Mensagem detalhada de erro para o usuário
        }
    };

    return (
        <div className="header">
            <h1 className='admin'>Painel Administrador</h1>
            <form className="form" onSubmit={handleSubmit}>
                <h1>Conecte-se</h1>
                
                <label htmlFor="email">E-mail</label>
                <input 
                    type="email" 
                    id="email" 
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />

                <label htmlFor="password">Senha</label>
                <input 
                    type="password" 
                    id="password" 
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />

                <div className="links">
                    <div className='link'> 
                        <a href="/recuperar-senha">Esqueceu a senha?</a>
                        <a href={`https://wa.me/${whatsappNumber}?text=${message}`} target="_blank" rel="noopener noreferrer">Contrate</a>
                    </div>
                    
                    <button type="submit">Acessar</button> 
                </div>
            </form>
        </div>
    );
}

export default Administrador;
