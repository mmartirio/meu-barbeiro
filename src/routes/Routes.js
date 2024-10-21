import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Admin from '../administrador/loginAdmin/Login';
import AdminDashboard from '../administrador/painel/AdminDashboard';
import Usuario from '../administrador/components/usuario/Usuario'
import Servicos from '../administrador/components/servicos/Services'
import Agenda from '../administrador/components/agenda/Agenda';
import Relatorio from '../administrador/components/relatorios/Relatorio';
import RecuperarSenha from '../administrador/loginAdmin/RecuperaSenha';

const AppRoutes = () => {
  return (
    <Routes>

      {/* Rotas adicionais, por exemplo, para administração */}
      <Route path="/admin" element={<Admin />}>
      </Route>
      <Route path="dashboard" element={<AdminDashboard />}>
      </Route>
      <Route path="/usuario" element={<Usuario />}>
      </Route>
      <Route path="/servicos" element={<Servicos />}>
      </Route>
      <Route path="/agenda" element={<Agenda />}>
      </Route>
      <Route path="/relatorios" element={<Relatorio />}>
      </Route>
      <Route path="/recuperar-senha" element={<RecuperarSenha />}>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
