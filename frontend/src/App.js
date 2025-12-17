import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PessoaProvider } from './contexts/PessoaContext';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import './index.css';

/**
 * Componente principal da aplicação
 * Responsável por configurar os providers globais e o roteamento
 */
function App() {
  return (
    <ErrorBoundary>
      <PessoaProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <AppRoutes />
          </Suspense>
        </BrowserRouter>
      </PessoaProvider>
    </ErrorBoundary>
  );
}

export default App;