import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de card reutilizável para exibir conteúdo em uma caixa.
 * @param {object} props - As props do componente.
 * @param {string} [props.title] - Título opcional exibido no topo do card.
 * @param {React.ReactNode} props.children - Conteúdo a ser renderizado dentro do card.
 * @param {string} [props.className=""] - Classes CSS adicionais para customização.
 */
const Card = ({ title, children, className = "" }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-xl transform hover:-translate-y-1 ${className}`}>
            {title && <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>}
            {children}
        </div>
    );
};

Card.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Card;