// frontend/src/pages/EditarPessoa/EditarPessoa.js
import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PessoaContext } from '../../contexts/PessoaContext';
import PessoaForm from '../../components/PessoaForm';
import Card from '../../components/Card';

const EditarPessoa = () => {
    const { id } = useParams();
    const { pessoas, updatePessoa } = useContext(PessoaContext);
    const navigate = useNavigate();
    
    const [pessoa, setPessoa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // 1. Busca a pessoa na lista existente no Contexto
    useEffect(() => {
        // Converter ID para número se seu ID for numérico (comum em SQLite)
        const pessoaEncontrada = pessoas.find(p => p.id === parseInt(id));
        
        if (pessoaEncontrada) {
            setPessoa(pessoaEncontrada);
        }
        setLoading(false);
    }, [id, pessoas]);

    const handleSuccess = async () => {
        setSubmitSuccess(true);
        // Pequeno delay para o usuário ver a mensagem de sucesso
        setTimeout(() => {
            navigate('/pessoas');
        }, 1500);
    };

    if (loading) {
        return <div className="text-center py-10">Carregando dados para edição...</div>;
    }

    if (!pessoa) {
        return (
            <Card className="border-l-4 border-l-red-500 bg-red-50">
                <div className="text-red-700">
                    Pessoa não encontrada com o ID: {id}
                </div>
            </Card>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto animate-fade-in pb-12 px-4 md:px-0">
            <div className="mb-8 pb-4 border-b border-gray-200">
                <h2 className="text-3xl font-serif text-gray-900">Editar Cadastro</h2>
                <p className="text-gray-500 mt-2">
                    Altere os dados abaixo para atualizar o cadastro no sistema.
                </p>
            </div>

            {submitSuccess ? (
                <Card className="border-t-4 border-t-green-500 bg-green-50 text-center">
                    <div className="text-green-800 py-6">
                        <strong className="block text-xl mb-2 font-serif">
                            Atualizado!
                        </strong>
                        Os dados foram salvos com sucesso. Redirecionando…
                    </div>
                </Card>
            ) : (
                <Card className="max-w-4xl mx-auto">
                    {/* 
                       IMPORTANTE: Passamos a pessoa encontrada para o formulário.
                       Verifique se o seu componente PessoaForm aceita a prop 'initialData' 
                       ou 'pessoa' para preencher os inputs.
                    */}
                    <PessoaForm 
                        initialData={pessoa} 
                        onSuccess={handleSuccess} 
                        isEditing={true}
                    />
                </Card>
            )}
        </div>
    );
};

export default EditarPessoa;