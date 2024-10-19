import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Admin from '../administrador/loginAdmin/Login';
import AdminDashboard from '../administrador/painel/AdminDashboard';



const AppRoutes = () => {
  return (
    <Routes>

      {/* Rotas adicionais, por exemplo, para administração */}
      <Route path="/admin" element={<Admin />}>
      </Route>
      <Route path="dashboard" element={<AdminDashboard />}>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
