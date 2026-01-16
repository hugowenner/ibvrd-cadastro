import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// Ícones
import { FaHome, FaUsers, FaBirthdayCake, FaUserPlus, FaUserShield, FaTimes, FaSignOutAlt, FaPrayingHands, FaCalendarAlt } from 'react-icons/fa';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout, user } = useAuth(); // ADICIONADO: Pega o usuário logado

    // Toggle via Custom Event (comunicação com Header)
    useEffect(() => {
        const handleToggle = () => setIsOpen(prev => !prev);
        window.addEventListener('toggle-mobile-sidebar', handleToggle);
        return () => window.removeEventListener('toggle-mobile-sidebar', handleToggle);
    }, []);

    // Função de Logout
    const handleLogout = () => {
        logout();
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    };

    const baseClasses = "flex items-center py-3 md:py-4 px-6 md:px-8 border-l-4 transition-all duration-300 group relative overflow-hidden";
    const activeClasses = "border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-inner";
    const inactiveClasses = "border-transparent text-gray-500 hover:bg-white hover:text-amber-700 hover:border-gray-200 hover:shadow-sm";

    const linkClasses = ({ isActive }) =>
        `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;

    return (
        <>
            {/* Overlay Mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none md:static md:translate-x-0 md:z-auto
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Close Button Mobile Only */}
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-gray-600 p-2"
                    aria-label="Fechar menu"
                >
                    <FaTimes size={24} />
                </button>

                <div className="p-6 md:p-8 border-b border-gray-50 mt-10 md:mt-0">
                    <h1 className="text-2xl md:text-3xl font-serif text-gray-900 font-bold tracking-tight flex items-center gap-3">
                        <span className="w-2 h-6 md:h-8 bg-amber-600 rounded-full block"></span>
                        IBVRD
                    </h1>
                    <p className="pl-5 text-[10px] md:text-xs text-gray-400 mt-2 uppercase tracking-[0.2em] font-medium">Administração</p>
                </div>
                
                <nav className="flex-1 mt-4 md:mt-6 space-y-1 overflow-y-auto">
                    <NavLink to="/dashboard" className={linkClasses} onClick={() => setIsOpen(false)}>
                        <FaHome className="text-lg md:text-lg transition-transform duration-300 group-hover:scale-110 text-amber-500" />
                        <span className="ml-4 font-serif text-sm md:text-sm tracking-wide">Dashboard</span>
                    </NavLink>
                    <NavLink to="/pessoas" className={linkClasses} onClick={() => setIsOpen(false)}>
                        <FaUsers className="text-lg md:text-lg transition-transform duration-300 group-hover:scale-110 text-amber-500" />
                        <span className="ml-4 font-serif text-sm md:text-sm tracking-wide">Pessoas Cadastradas</span>
                    </NavLink>
                    <NavLink to="/aniversariantes" className={linkClasses} onClick={() => setIsOpen(false)}>
                        <FaBirthdayCake className="text-lg md:text-lg transition-transform duration-300 group-hover:scale-110 text-amber-500" />
                        <span className="ml-4 font-serif text-sm md:text-sm tracking-wide">Aniversariantes</span>
                    </NavLink>
                    <NavLink to="/cadastro" className={linkClasses} onClick={() => setIsOpen(false)}>
                        <FaUserPlus className="text-lg md:text-lg transition-transform duration-300 group-hover:scale-110 text-amber-500" />
                        <span className="ml-4 font-serif text-sm md:text-sm tracking-wide">Novo Cadastro</span>
                    </NavLink>
                    
                    {/* Link para Mural de Oração */}
                    <NavLink to="/pedidos-oracao" className={linkClasses} onClick={() => setIsOpen(false)}>
                        <FaPrayingHands className="text-lg md:text-lg transition-transform duration-300 group-hover:scale-110 text-amber-500" />
                        <span className="ml-4 font-serif text-sm md:text-sm tracking-wide">Mural de Oração</span>
                    </NavLink>

                    {/* Link para Histórico de Visitas */}
                    <NavLink to="/visitas" className={linkClasses} onClick={() => setIsOpen(false)}>
                        <FaCalendarAlt className="text-lg md:text-lg transition-transform duration-300 group-hover:scale-110 text-amber-500" />
                        <span className="ml-4 font-serif text-sm md:text-sm tracking-wide">Histórico de Visitas</span>
                    </NavLink>

                    {/* ADICIONADO: Link para Novo Usuário (Só Admin) */}
                    {user?.role === 'admin' && (
                        <NavLink to="/cadastro-usuario" className={linkClasses} onClick={() => setIsOpen(false)}>
                            <FaUserShield className="text-lg md:text-lg transition-transform duration-300 group-hover:scale-110 text-amber-500" />
                            <span className="ml-4 font-serif text-sm md:text-sm tracking-wide">Novo Usuário</span>
                        </NavLink>
                    )}
                </nav>

                {/* BOTÃO DE SAIR */}
                <div className="p-4 md:p-6 border-t border-gray-50 mt-auto">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center w-full py-3 md:py-4 px-6 md:px-8 border-l-4 border-transparent text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 hover:shadow-sm transition-all duration-300 group relative overflow-hidden"
                    >
                        <FaSignOutAlt className="text-lg transition-transform duration-300 group-hover:scale-110 text-gray-400 group-hover:text-red-600" />
                        <span className="ml-4 font-serif text-sm md:text-sm tracking-wide">Sair do Sistema</span>
                    </button>
                </div>

                <div className="p-6 md:p-8 border-t border-gray-50 bg-stone-50/30">
                    <div className="text-[10px] text-gray-400 text-center font-serif tracking-widest uppercase leading-relaxed">
                        © IBVRD<br/>Sistema Administrativo
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;