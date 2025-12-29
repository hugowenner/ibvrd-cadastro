import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { PessoaContext } from '../../contexts/PessoaContext';

const FormInput = ({ label, id, name, value, onChange, type = 'text', required = false, ...props }) => (
    <div className="mb-5">
        <label htmlFor={id} className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 transition duration-200 ease-in-out"
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
            navigate('/pessoas');
        } catch (err) {
            setError(err.message || 'Ocorreu um erro ao cadastrar a pessoa. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm" role="alert">
                    <p className="font-bold">Erro</p>
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                    <FormInput
                        label="Nome Completo"
                        id="nomeCompleto"
                        name="nomeCompleto"
                        value={formData.nomeCompleto}
                        onChange={handleChange}
                        required
                    />
                </div>

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

                <div className="col-span-1 md:col-span-2">
                    <FormInput
                        label="E-mail"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        required
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <FormInput
                        label="Endereço"
                        id="endereco"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="tipo" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tipo</label>
                    <select name="tipo" id="tipo" value={formData.tipo} onChange={handleChange} className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 transition duration-200 ease-in-out">
                        <option value="Visitante">Visitante</option>
                        <option value="Membro">Membro</option>
                        <option value="Líder">Líder</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="ministerio" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ministério</label>
                    <select name="ministerio" id="ministerio" value={formData.ministerio} onChange={handleChange} className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 transition duration-200 ease-in-out">
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

                <div className="col-span-1 md:col-span-2">
                    <label htmlFor="observacoes" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Observações</label>
                    <textarea name="observacoes" id="observacoes" value={formData.observacoes} onChange={handleChange} rows="4" className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 transition duration-200 ease-in-out"></textarea>
                </div>
            </div>

            <div className="pt-4">
                <button type="submit" disabled={isSubmitting} className="w-full bg-amber-600 text-white font-bold uppercase tracking-widest text-sm py-4 px-6 rounded shadow hover:bg-amber-700 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5">
                    {isSubmitting ? 'Processando...' : 'Cadastrar Pessoa'}
                </button>
            </div>
        </form>
    );
};

export default PessoaForm;