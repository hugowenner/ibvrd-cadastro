import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PessoaProvider } from './contexts/PessoaContext';
import AppRoutes from './routes/AppRoutes';
import './index.css'; // <--- LINHA CORRIGIDA

function App() {
  return (
    <PessoaProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </PessoaProvider>
  );
}

export default App;