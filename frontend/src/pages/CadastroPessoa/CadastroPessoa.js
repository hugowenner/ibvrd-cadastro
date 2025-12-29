import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PessoaContext } from '../../contexts/PessoaContext';
import PessoaForm from '../../components/PessoaForm/PessoaForm';
import Card from '../../components/Card/Card';

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
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="mb-10 pb-4 border-b border-gray-200">
                <h2 className="text-3xl md:text-4xl font-serif text-gray-900 font-normal">Novo Cadastro</h2>
                <p className="text-gray-500 mt-2 font-light">Preencha os dados abaixo para adicionar uma nova pessoa ao sistema.</p>
            </div>
            
            {submitSuccess ? (
                <Card className="border-t-4 border-t-green-500 bg-green-50">
                    <div className="text-green-800">
                        <strong className="font-bold block text-lg mb-1">Sucesso!</strong> 
                        Pessoa cadastrada com sucesso! Redirecionando...
                    </div>
                </Card>
            ) : (
                <Card className="max-w-3xl mx-auto">
                    <PessoaForm onSuccess={handleSuccess} />
                </Card>
            )}
        </div>
    );
};

export default CadastroPessoa;