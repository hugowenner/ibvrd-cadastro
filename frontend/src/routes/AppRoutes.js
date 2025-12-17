import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../AppLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Pessoas from '../pages/Pessoas/Pessoas';
import CadastroPessoa from '../pages/CadastroPessoa/CadastroPessoa';
import Aniversariantes from '../pages/Aniversariantes/Aniversariantes'; // <-- IMPORTAR A NOVA PÁGINA

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="pessoas" element={<Pessoas />} />
                <Route path="cadastro" element={<CadastroPessoa />} />
                <Route path="aniversariantes" element={<Aniversariantes />} /> {/* <-- ADICIONAR A NOVA ROTA */}
            </Route>
        </Routes>
    );
};

export default AppRoutes;