import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // Para estilos específicos do NavLink

const Sidebar = () => {
    return (
        <aside className="w-64 bg-azul-ibvrd text-white flex-shrink-0">
            <div className="p-4 text-xl font-semibold">
                IBVRD
            </div>
            <nav className="mt-4">
                <NavLink to="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700">
                    Dashboard
                </NavLink>
                <NavLink to="/pessoas" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700">
                    Pessoas Cadastradas
                </NavLink>
                <NavLink to="/aniversariantes" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700">
                    Aniversariantes do Mês
                </NavLink> {/* <-- ADICIONAR O NOVO LINK */}
                <NavLink to="/cadastro" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700">
                    Novo Cadastro
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;