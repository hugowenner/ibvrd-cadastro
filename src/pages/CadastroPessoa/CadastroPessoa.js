import React from 'react';
import PessoaForm from '../../components/PessoaForm/PessoaForm';

const CadastroPessoa = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Novo Cadastro</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <PessoaForm />
            </div>
        </div>
    );
};

export default CadastroPessoa;