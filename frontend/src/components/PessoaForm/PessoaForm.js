import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { PessoaContext } from '../../contexts/PessoaContext';

// Componente interno para reutilização de campos de formulário
const FormInput = ({ label, id, name, value, onChange, type = 'text', required = false, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm transition-all duration-200 focus:ring-2"
            {...props}
        />
    </div>
);

const PessoaForm = () => {
    const { addPessoa } = useContext(PessoaContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nomeCompleto: '',
        dataNascimento: '',
        telefone: '',
        email: '',
        endereco: '',
        tipo: 'Visitante',
        ministerio: 'Nenhum',
        observacoes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            await addPessoa(formData);
            navigate('/pessoas'); // Redireciona para a lista de pessoas
        } catch (err) {
            setError(err.message || 'Ocorreu um erro ao cadastrar a pessoa. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative animate-pulse" role="alert">
                    <strong className="font-bold">Erro: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <FormInput
                label="Nome Completo"
                id="nomeCompleto"
                name="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={handleChange}
                required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Data de Nascimento"
                    id="dataNascimento"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    type="date"
                    required
                />
                <FormInput
                    label="Telefone"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    type="tel"
                    required
                />
            </div>

            <FormInput
                label="E-mail"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
            />

            <FormInput
                label="Endereço"
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo</label>
                    <select name="tipo" id="tipo" value={formData.tipo} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm transition-all duration-200 focus:ring-2">
                        <option value="Visitante">Visitante</option>
                        <option value="Membro">Membro</option>
                        <option value="Líder">Líder</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="ministerio" className="block text-sm font-medium text-gray-700">Ministério</label>
                    <select name="ministerio" id="ministerio" value={formData.ministerio} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm transition-all duration-200 focus:ring-2">
                        <option value="Nenhum">Nenhum</option>
                        <option value="Louvor">Louvor</option>
                        <option value="Música">Música</option>
                        <option value="Infantil">Infantil</option>
                        <option value="Adolescentes">Adolescentes</option>
                        <option value="Jovens">Jovens</option>
                        <option value="Missões">Missões</option>
                        <option value="Ação Social">Ação Social</option>
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700">Observações</label>
                <textarea name="observacoes" id="observacoes" value={formData.observacoes} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm transition-all duration-200 focus:ring-2"></textarea>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-azul-ibvrd text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95">
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar Pessoa'}
            </button>
        </form>
    );
};

export default PessoaForm;