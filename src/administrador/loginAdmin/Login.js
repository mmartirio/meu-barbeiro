
import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';


import './Login.css';
import Button from '../../components/Button';

import FeedbackMessage from '../../components/FeedbackMessage';
import { useTranslation } from 'react-i18next';



function Administrador() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate();
    const whatsappNumber = '+5579991071656';
    const message = encodeURIComponent('Estou entrando em contato para saber como posso utilizar o *Meu Barbeiro* no meu negócio');
    // Remove qualquer background customizado ao entrar na tela de login
    React.useEffect(() => {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = '#28282c'; // cor escura padrão do tema dark
        document.body.classList.remove('custom-background');
        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = '';
        };
    }, []);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setLoading(true);
        const credentials = { email, password };
        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            if (!response.ok) {
                const errorData = await response.json();
                setErrorMsg(errorData.message || t('login.error'));
                if (emailRef.current) emailRef.current.focus();
                setLoading(false);
                return;
            }
            const data = await response.json();
            // Buscar configurações do tenant (logo e tema)
            // Busca de configurações do tenant removida do login
            setSuccessMsg(t('login.success'));
            // Salva o token no contexto de autenticação
            if (data.token) {
                login(data.token);
            }
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (error) {
            setErrorMsg(error.message || t('login.error'));
            if (emailRef.current) emailRef.current.focus();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="header">
            <h1 className='admin'>{t('login.title')}</h1>
            <form className="form" onSubmit={handleSubmit} autoComplete="on" aria-label={t('login.connect')}>
                <h1>{t('login.connect')}</h1>
                <FeedbackMessage message={errorMsg} type="error" onClose={() => setErrorMsg('')} />
                <FeedbackMessage message={successMsg} type="success" onClose={() => setSuccessMsg('')} />
                <label htmlFor="email">{t('login.email')}</label>
                <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    name="email"
                    placeholder={t('login.email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    aria-required="true"
                    aria-label="E-mail"
                />
                <label htmlFor="password">{t('login.password')}</label>
                <input
                    ref={passwordRef}
                    type="password"
                    id="password"
                    name="password"
                    placeholder={t('login.password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-required="true"
                    aria-label="Senha"
                />
                <div className="links">
                    <div className='link'>
                        <a href="/recuperar-senha">{t('login.forgot')}</a>
                        <a href={`https://wa.me/${whatsappNumber}?text=${message}`} target="_blank" rel="noopener noreferrer">{t('login.hire')}</a>
                    </div>
                    <Button type="submit" loading={loading} aria-busy={loading} className={loading ? 'loading' : ''}>
                        {t('login.access')}
                    </Button>
                </div>
                <div className="register-link">
                    <p>Não tem uma conta? <a href="/cadastro-barbearia">Cadastre-se aqui</a></p>
                </div>
            </form>
        </div>
    );
}

export default Administrador;
