import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Admin from '../administrador/loginAdmin/Login';
import AdminDashboard from '../administrador/painel/AdminDashboard';
import Usuario from '../administrador/components/usuario/Usuario';
import Servicos from '../administrador/components/servicos/Services';
import Agenda from '../administrador/components/agenda/Agenda';
import Relatorio from '../administrador/components/relatorios/Relatorio';
import RecuperarSenha from '../administrador/loginAdmin/RecuperaSenha';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
      <Route path="/usuario" element={<PrivateRoute><Usuario /></PrivateRoute>} />
      <Route path="/servicos" element={<PrivateRoute><Servicos /></PrivateRoute>} />
      <Route path="/agenda" element={<PrivateRoute><Agenda /></PrivateRoute>} />
      <Route path="/relatorios" element={<PrivateRoute><Relatorio /></PrivateRoute>} />
    </Routes>
  );
};

export default AppRoutes;
