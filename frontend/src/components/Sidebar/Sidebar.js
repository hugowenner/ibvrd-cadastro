import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaBirthdayCake, FaUserPlus } from 'react-icons/fa';

const Sidebar = () => {
    // Estilo para links inativos e ativos
    const baseClasses = "flex items-center py-4 px-6 border-l-4 transition-all duration-300 group";
    const activeClasses = "border-amber-600 bg-amber-50 text-amber-800 font-medium";
    const inactiveClasses = "border-transparent text-gray-600 hover:bg-gray-50 hover:text-amber-700 hover:border-gray-200";

    const linkClasses = ({ isActive }) =>
        `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;

    return (
        <aside className="w-full md:w-72 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col transition-all duration-300 h-screen sticky top-0">
            <div className="p-8 border-b border-gray-100">
                <h1 className="text-3xl font-serif text-gray-900 font-bold tracking-tight">IBVRD</h1>
                <div className="w-8 h-1 bg-amber-600 mt-2"></div>
            </div>
            
            <nav className="flex-1 mt-6 space-y-1">
                <NavLink to="/dashboard" className={linkClasses}>
                    <FaHome className="text-lg transition-transform duration-300 group-hover:scale-110 text-amber-600" />
                    <span className="ml-4 font-serif">Dashboard</span>
                </NavLink>
                <NavLink to="/pessoas" className={linkClasses}>
                    <FaUsers className="text-lg transition-transform duration-300 group-hover:scale-110 text-amber-600" />
                    <span className="ml-4 font-serif">Pessoas Cadastradas</span>
                </NavLink>
                <NavLink to="/aniversariantes" className={linkClasses}>
                    <FaBirthdayCake className="text-lg transition-transform duration-300 group-hover:scale-110 text-amber-600" />
                    <span className="ml-4 font-serif">Aniversariantes</span>
                </NavLink>
                <NavLink to="/cadastro" className={linkClasses}>
                    <FaUserPlus className="text-lg transition-transform duration-300 group-hover:scale-110 text-amber-600" />
                    <span className="ml-4 font-serif">Novo Cadastro</span>
                </NavLink>
            </nav>

            <div className="p-6 border-t border-gray-100">
                <div className="text-xs text-gray-400 text-center font-serif tracking-widest uppercase">
                    Sistema Administrativo
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;