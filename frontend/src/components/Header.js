// src/components/Header.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaBars } from 'react-icons/fa';

const Header = ({ title = "Sistema de Cadastro IBVRD" }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Emite evento para o Sidebar saber que o menu foi clicado no Header
    const toggleMenu = () => {
        const event = new CustomEvent('toggle-mobile-sidebar');
        window.dispatchEvent(event);
    };

    return (
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-30 transition-all duration-300 shadow-sm h-16 md:h-auto">
            <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={toggleMenu}
                        className="md:hidden text-gray-600 hover:text-amber-600 transition-colors p-2"
                        aria-label="Abrir menu"
                    >
                        <FaBars size={24} />
                    </button>
                    <div className="flex flex-col justify-center">
                        <h1 className="text-lg md:text-3xl lg:text-4xl font-serif text-gray-900 tracking-tight font-medium leading-tight">{title}</h1>
                    </div>
                </div>
                
                <div className="hidden md:block w-16 h-1 bg-amber-600 rounded-full shadow-[0_0_10px_rgba(217,119,6,0.5)]"></div>
            </div>
        </header>
    );
};

Header.propTypes = {
    title: PropTypes.string,
};

export default Header;