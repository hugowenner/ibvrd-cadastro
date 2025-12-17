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
                <div className="flex items-center justify-center h-screen">
                    <Card className="max-w-md">
                        <h2 className="text-xl font-bold text-red-600 mb-4">Ocorreu um erro inesperado</h2>
                        <p className="text-gray-700 mb-4">
                            Desculpe, algo deu errado. Por favor, tente recarregar a página.
                        </p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-azul-ibvrd text-white px-4 py-2 rounded hover:bg-blue-700"
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