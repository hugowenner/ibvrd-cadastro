import React, { Suspense } from 'react';
import { HashRouter } from 'react-router-dom';
import { PessoaProvider } from './contexts/PessoaContext';

// NOVO IMPORT: Provider de Autenticação
import { AuthProvider } from './contexts/AuthContext';

import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      {/* O AuthProvider fica por fora para gerenciar a sessão globalmente */}
      <AuthProvider>
        <PessoaProvider>
          <HashRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <AppRoutes />
            </Suspense>
          </HashRouter>
        </PessoaProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;