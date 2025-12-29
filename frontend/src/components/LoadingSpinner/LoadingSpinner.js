import React from 'react';

const LoadingSpinner = ({ message = "Carregando..." }) => {
    return (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
            <p className="mt-4 text-gray-500 font-medium tracking-wide">{message}</p>
        </div>
    );
};

export default LoadingSpinner;