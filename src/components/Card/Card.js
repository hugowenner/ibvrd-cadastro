import React from 'react';

const Card = ({ title, children, className = "" }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            {title && <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>}
            {children}
        </div>
    );
};

export default Card;