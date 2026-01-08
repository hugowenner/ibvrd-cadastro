// src/components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ message = "Carregando..." }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] h-80 bg-white rounded-xl shadow-sm border border-gray-100 w-full">
            <div className="relative w-12 h-12 md:w-16 md:h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 md:mt-6 text-gray-400 font-medium tracking-wide text-xs md:text-sm uppercase">{message}</p>
        </div>
    );
};

export default LoadingSpinner;