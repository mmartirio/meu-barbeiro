import './App.css';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Login = lazy(() => import('./components/login/login'));
const CalendarComponent = lazy(() => import('./components/agendamento/calendar/calendarComponent'));
const Profissional = lazy(() => import('./components/agendamento/Profissional/profissional'));
const Servico = lazy(() => import('./components/agendamento/service/servico'));


const AppRoutes = lazy(() => import('./routes/Routes'));

import Logo from './assets/logo-meu-barbeiro.png';

function App() {
    return (
        <Router>
            <div className='container'>
                <Suspense fallback={<div>Loading...</div>}>
                    <img className='logo' src={Logo} alt='logo' title='logo' />
                    <Routes>
                        {/* Rota da página de login */}
                        <Route path="/" element={<Login />} />

                        {/* Rota para o componente de agendamento com o calendário */}
                        <Route path="/agendamento/calendarComponent" element={<CalendarComponent />} />

                        {/* Rota para o componente de seleção de profissional */}
                        <Route path="/profissional" element={<Profissional />} />

                        {/* Rota para o componente de seleção de serviço */}
                        <Route path="/servico" element={<Servico />} />

                        {/* Rotas adicionais carregadas de forma lazy */}
                        <Route path="/*" element={<AppRoutes />} />
                    </Routes>
                </Suspense>
            </div>
        </Router>
    );
}

export default App;
