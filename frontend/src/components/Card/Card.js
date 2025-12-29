import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ title, children, className = "" }) => {
    return (
        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6 ${className}`}>
            {title && (
                <div className="mb-4">
                    <h3 className="text-xl font-serif text-gray-800 font-semibold">{title}</h3>
                    <div className="w-12 h-0.5 bg-amber-600 mt-2"></div>
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