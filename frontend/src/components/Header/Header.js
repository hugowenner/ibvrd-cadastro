import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de cabeçalho da aplicação.
 * @param {object} props - As props do componente.
 * @param {string} [props.title="Sistema de Cadastro IBVRD"] - Título a ser exibido no cabeçalho.
 */
const Header = ({ title = "Sistema de Cadastro IBVRD" }) => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 transition-all duration-300">
            <div className="px-6 py-4">
                <h1 className="text-2xl font-bold text-azul-ibvrd transition-colors duration-300 hover:text-blue-700">{title}</h1>
            </div>
        </header>
    );
};

Header.propTypes = {
    title: PropTypes.string,
};

export default Header;