import React, { Component } from 'react';
import Card from '../Card/Card';

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
                <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
                    <Card className="max-w-md w-full border-t-4 border-t-amber-600">
                        <h2 className="text-2xl font-serif text-gray-900 mb-4">Ocorreu um erro inesperado</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Desculpe, algo deu errado. Por favor, tente recarregar a página.
                        </p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full bg-amber-600 text-white font-semibold uppercase tracking-widest text-sm py-3 px-4 rounded hover:bg-amber-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
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