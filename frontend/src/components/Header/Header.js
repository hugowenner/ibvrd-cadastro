import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ title = "Sistema de Cadastro IBVRD" }) => {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 transition-all duration-300">
            <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-2 md:mb-0">
                    <h1 className="text-3xl md:text-4xl font-serif text-gray-900 tracking-tight">{title}</h1>
                    <div className="w-24 h-1 bg-amber-600 mt-3"></div>
                </div>
                {/* Espaço reservado para elementos futuros se necessário */}
                <div></div> 
            </div>
        </header>
    );
};

Header.propTypes = {
    title: PropTypes.string,
};

export default Header;