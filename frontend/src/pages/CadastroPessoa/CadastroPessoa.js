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
            <div className="mb-8 md:mb-12 pb-4 border-b border-gray-200">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 font-normal">Novo Cadastro</h2>
                <p className="text-gray-500 mt-2 font-light text-sm md:text-base">Preencha os dados abaixo para adicionar uma nova pessoa ao sistema.</p>
            </div>
            
            {submitSuccess ? (
                <Card className="border-t-4 border-t-green-500 bg-green-50 text-center">
                    <div className="text-green-800 py-4 px-2">
                        <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <strong className="font-bold block text-lg md:text-xl mb-2 font-serif">Sucesso!</strong> 
                        <p className="text-sm md:text-base">Pessoa cadastrada com sucesso! Redirecionando...</p>
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