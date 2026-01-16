import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts e Páginas Existentes
import AppLayout from '../AppLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Pessoas from '../pages/Pessoas/Pessoas';
import CadastroPessoa from '../pages/CadastroPessoa/CadastroPessoa';
import Aniversariantes from '../pages/Aniversariantes/Aniversariantes';

// Importe a página de Cadastro de Usuário
import CadastroUsuario from '../pages/CadastroUsuario/CadastroUsuario';

// Importe a página de Mural de Oração
import PedidosOração from '../pages/PedidosOração/PedidosOração';

// ADICIONADO: Importe a página de Histórico de Visitas
import HistoricoVisitas from '../pages/HistoricoVisitas/HistoricoVisitas';

// Autenticação
import Login from '../pages/Login/Login';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Rota Pública de Login (Tem o Layout próprio) */}
            <Route path="/login" element={<Login />} />

            {/* ROTAS PROTEGIDAS (Todas dentro do AppLayout com Sidebar) */}
            <Route path="/" element={
                <ProtectedRoute>
                    <AppLayout />
                </ProtectedRoute>
            }>
                {/* Todas as rotas abaixo são filhas de "/" */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="pessoas" element={<Pessoas />} />
                <Route path="cadastro" element={<CadastroPessoa />} />
                <Route path="aniversariantes" element={<Aniversariantes />} />
                <Route path="cadastro-usuario" element={<CadastroUsuario />} />
                
                {/* Rota do Mural de Oração */}
                <Route path="pedidos-oracao" element={<PedidosOração />} />
                
                {/* ADICIONADO: Rota de Histórico de Visitas */}
                <Route path="visitas" element={<HistoricoVisitas />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;