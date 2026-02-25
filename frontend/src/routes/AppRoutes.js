import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts e Páginas Existentes
import AppLayout from '../AppLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Pessoas from '../pages/Pessoas/Pessoas';
import CadastroPessoa from '../pages/CadastroPessoa/CadastroPessoa';
import Aniversariantes from '../pages/Aniversariantes/Aniversariantes';
import CadastroUsuario from '../pages/CadastroUsuario/CadastroUsuario';
import PedidosOração from '../pages/PedidosOração/PedidosOração';
import HistoricoVisitas from '../pages/HistoricoVisitas/HistoricoVisitas';
import Login from '../pages/Login/Login';
import ProtectedRoute from '../components/ProtectedRoute';

// IMPORTAÇÃO: Gerenciamento de Usuários
import UserManagement from '../pages/UserManagement/UserManagement';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rota Pública de Login */}
      <Route path="/login" element={<Login />} />

      {/* ROTAS PROTEGIDAS (Dentro do AppLayout) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pessoas" element={<Pessoas />} />
        <Route path="cadastro" element={<CadastroPessoa />} />
        <Route path="aniversariantes" element={<Aniversariantes />} />

        {/* Gerenciamento de Usuários */}
        <Route path="usuarios" element={<UserManagement />} />

        <Route path="cadastro-usuario" element={<CadastroUsuario />} />
        <Route path="pedidos-oracao" element={<PedidosOração />} />
        <Route path="visitas" element={<HistoricoVisitas />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;