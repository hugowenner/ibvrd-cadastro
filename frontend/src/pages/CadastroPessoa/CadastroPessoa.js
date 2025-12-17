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
        // Redireciona após um breve período para mostrar a mensagem de sucesso
        setTimeout(() => {
            navigate('/pessoas');
        }, 2000);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Novo Cadastro</h2>
            
            {submitSuccess ? (
                <Card>
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded animate-pulse">
                        <strong>Sucesso!</strong> Pessoa cadastrada com sucesso! Redirecionando...
                    </div>
                </Card>
            ) : (
                <Card>
                    <PessoaForm onSuccess={handleSuccess} />
                </Card>
            )}
        </div>
    );
};

export default CadastroPessoa;