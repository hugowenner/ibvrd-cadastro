import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaBirthdayCake, FaUserPlus } from 'react-icons/fa';

const Sidebar = () => {
    const linkClasses = ({ isActive }) =>
        `flex items-center py-2.5 px-4 rounded transition-all duration-200 ease-in-out hover:bg-blue-700 hover:translate-x-1 ${
            isActive ? 'bg-blue-700' : ''
        }`;

    return (
        <aside className="w-64 bg-azul-ibvrd text-white flex-shrink-0 transition-all duration-300">
            <div className="p-4 text-xl font-semibold">
                IBVRD
            </div>
            <nav className="mt-4">
                <NavLink to="/dashboard" className={linkClasses}>
                    <FaHome className="mr-3 transition-transform duration-200 group-hover:scale-110" />
                    Dashboard
                </NavLink>
                <NavLink to="/pessoas" className={linkClasses}>
                    <FaUsers className="mr-3 transition-transform duration-200 group-hover:scale-110" />
                    Pessoas Cadastradas
                </NavLink>
                <NavLink to="/aniversariantes" className={linkClasses}>
                    <FaBirthdayCake className="mr-3 transition-transform duration-200 group-hover:scale-110" />
                    Aniversariantes do Mês
                </NavLink>
                <NavLink to="/cadastro" className={linkClasses}>
                    <FaUserPlus className="mr-3 transition-transform duration-200 group-hover:scale-110" />
                    Novo Cadastro
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;