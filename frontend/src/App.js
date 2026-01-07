import React, { Suspense } from 'react';
import { HashRouter } from 'react-router-dom';
import { PessoaProvider } from './contexts/PessoaContext';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <PessoaProvider>
        <HashRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <AppRoutes />
          </Suspense>
        </HashRouter>
      </PessoaProvider>
    </ErrorBoundary>
  );
}

export default App;
