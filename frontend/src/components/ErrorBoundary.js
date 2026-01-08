// src/components/ErrorBoundary.js
import React, { Component } from 'react';
import Card from './Card';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Erro capturado pelo ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-stone-50 px-4 py-8">
                    <Card className="w-full max-w-md border-t-4 border-t-amber-600 text-center">
                        <div className="mb-4 flex justify-center text-amber-600">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        </div>
                        <h2 className="text-xl md:text-2xl font-serif text-gray-900 mb-4">Ocorreu um erro inesperado</h2>
                        <p className="text-gray-600 mb-6 md:mb-8 leading-relaxed font-light text-sm md:text-base">
                            Desculpe, algo deu errado. Por favor, tente recarregar a página.
                        </p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full bg-amber-600 text-white font-bold uppercase tracking-widest text-xs py-3 md:py-4 px-6 rounded-xl shadow-md hover:bg-amber-700 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 min-h-[44px]"
                        >
                            Recarregar Página
                        </button>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;