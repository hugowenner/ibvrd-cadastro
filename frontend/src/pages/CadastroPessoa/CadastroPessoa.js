// src/pages/CadastroPessoa/CadastroPessoa.js
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PessoaContext } from '../../contexts/PessoaContext';
import PessoaForm from '../../components/PessoaForm';
import Card from '../../components/Card';

const CadastroPessoa = () => {
    const { addPessoa } = useContext(PessoaContext);
    const navigate = useNavigate();
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleSuccess = () => {
        setSubmitSuccess(true);
        setTimeout(() => {
            navigate('/pessoas');
        }, 2000);
    };

    return (
        <div className="w-full max-w-5xl mx-auto animate-fade-in pb-12 px-4 md:px-0">
            <div className="mb-8 pb-4 border-b border-gray-200">
                <h2 className="text-3xl font-serif text-gray-900">Novo Cadastro</h2>
                <p className="text-gray-500 mt-2">
                    Preencha os dados abaixo para adicionar uma nova pessoa ao sistema.
                </p>
            </div>

            {submitSuccess ? (
                <Card className="border-t-4 border-t-green-500 bg-green-50 text-center">
                    <div className="text-green-800 py-6">
                        <strong className="block text-xl mb-2 font-serif">
                            Sucesso!
                        </strong>
                        Pessoa cadastrada com sucesso. Redirecionando…
                    </div>
                </Card>
            ) : (
                <Card className="max-w-4xl mx-auto">
                    <PessoaForm onSuccess={handleSuccess} />
                </Card>
            )}
        </div>
    );
};

export default CadastroPessoa;
