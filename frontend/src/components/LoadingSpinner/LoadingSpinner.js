import React from 'react';

const LoadingSpinner = ({ message = "Carregando..." }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azul-ibvrd"></div>
            <p className="mt-4 text-gray-600">{message}</p>
        </div>
    );
};

export default LoadingSpinner;