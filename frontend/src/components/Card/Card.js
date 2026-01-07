import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ title, children, className = "" }) => {
    return (
        <div className={`bg-white rounded-xl border border-gray-100 shadow-sm md:shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 md:p-8 ${className}`}>
            {title && (
                <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="text-xl md:text-2xl font-serif text-gray-900 font-semibold tracking-tight">{title}</h3>
                    <div className="h-1 w-full sm:w-auto sm:flex-1 sm:ml-6 bg-gradient-to-r from-amber-600 to-transparent opacity-50"></div>
                </div>
            )}
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