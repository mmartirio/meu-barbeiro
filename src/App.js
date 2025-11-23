import './App.css';
import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const Login = lazy(() => import('./components/login/login'));
const CalendarComponent = lazy(() => import('./components/agendamento/calendar/calendarComponent'));
const Profissional = lazy(() => import('./components/agendamento/Profissional/profissional'));
const Servico = lazy(() => import('./components/agendamento/service/servico'));
const AppRoutes = lazy(() => import('./routes/Routes'));
const AdminDashboard = lazy(() => import('./administrador/painel/AdminDashboard'));

import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import LanguageSwitcher from './components/LanguageSwitcher';
import Logo from './assets/logo-meu-barbeiro.png';
import { useAuth } from './hooks/useAuth';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    <MainLayout />
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

function MainLayout() {
    const { user } = useAuth();
    const location = useLocation();

    // Limpeza de backgrounds problemáticos na inicialização
    useEffect(() => {
        const savedBackground = localStorage.getItem('backgroundImage');
        if (savedBackground && savedBackground.includes('background-')) {
            console.log('Limpando background problemático do localStorage');
            localStorage.removeItem('backgroundImage');
        }
    }, []);

    if (!user) {
        // Só mostra o login se não estiver autenticado
        return (
            <div className="login-logo-container">
                <img className='logo' src={Logo} alt='logo' title='logo' />
                <Suspense fallback={<div className="loading-container">Carregando...</div>}>
                    <AppRoutes />
                </Suspense>
            </div>
        );
    }

    // Se estiver na rota /dashboard, renderiza só o dashboard (sem layout extra)
    if (location.pathname === '/dashboard') {
        return (
            <Suspense fallback={<div className="loading-container">Carregando Dashboard...</div>}>
                <AdminDashboard />
            </Suspense>
        );
    }

    // Demais rotas privadas mantêm layout global
    return (
        <div className='container' style={{ marginLeft: 0 }}>
            <Suspense fallback={<div className="loading-container">Carregando...</div>}>
                <img className='logo' src={Logo} alt='logo' title='logo' />
                <AppRoutes />
            </Suspense>
        </div>
    );
}

export default App;