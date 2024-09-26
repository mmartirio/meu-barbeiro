import './App.css';
import React from 'react';
import Logo from './assets/logo-meu-barbeiro.png';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login/login';
import CalendarComponent from './components/agendamento/calendar/calendarComponent';
import Profissional from './components/agendamento/Profissional/profissional';
import Servico from './components/agendamento/service/servico';

function App() {
    return (
        <Router>
            <div className='container'>
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
                </Routes>
            </div>
        </Router>
    );
}

export default App;
