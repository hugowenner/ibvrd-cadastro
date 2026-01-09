import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts e Páginas Existentes
import AppLayout from '../AppLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Pessoas from '../pages/Pessoas/Pessoas';
import CadastroPessoa from '../pages/CadastroPessoa/CadastroPessoa';
import Aniversariantes from '../pages/Aniversariantes/Aniversariantes';

// NOVOS ARQUIVOS PARA AUTENTICAÇÃO
import Login from '../pages/Login/Login';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            {/* ROTA PÚBLICA: Tela de Login (não precisa estar dentro do AppLayout) */}
            <Route path="/login" element={<Login />} />

            {/* ROTAS PROTEGIDAS: Só acessíveis se o usuário estiver logado */}
            <Route path="/" element={
                <ProtectedRoute>
                    <AppLayout />
                </ProtectedRoute>
            }>
                {/* Rotas aninhadas dentro do Layout */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="pessoas" element={<Pessoas />} />
                <Route path="cadastro" element={<CadastroPessoa />} />
                <Route path="aniversariantes" element={<Aniversariantes />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;