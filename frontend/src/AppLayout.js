import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';

/**
 * Componente de layout principal da aplicação
 * Responsável por estruturar o layout com sidebar, header e área de conteúdo
 */
const AppLayout = () => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100" role="application">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main 
                    className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6"
                    role="main"
                    aria-label="Conteúdo principal"
                >
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <Outlet />
                    )}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;