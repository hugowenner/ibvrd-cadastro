// src/components/PessoaForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { PessoaContext } from '../contexts/PessoaContext'; 

const FormInput = ({ label, id, name, value, onChange, type = 'text', required = false, ...props }) => (
    <div className="mb-4 md:mb-6 group">
        <label htmlFor={id} className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-amber-600 transition-colors duration-300">{label}</label>
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="block w-full px-4 py-3 md:px-5 md:py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all duration-300 shadow-sm text-base"
            {...props}
        />
    </div>
);

// Adicionei as props: initialData, isEditing e onSuccess
const PessoaForm = ({ initialData = null, isEditing = false, onSuccess }) => {
    // Adicionei updatePessoa aqui. Certifique-se que seu PessoaContext tem essa função!
    const { addPessoa, updatePessoa } = useContext(PessoaContext);
    const navigate = useNavigate();
    
    // Estado inicial condicional: Se veio dados pra editar, usa eles. Senão, usa vazio.
    const [formData, setFormData] = useState(
        initialData || {
            nomeCompleto: '',
            dataNascimento: '',
            telefone: '',
            email: '',
            endereco: '',
            tipo: 'Visitante',
            ministerio: 'Nenhum',
            observacoes: '',
        }
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Efeito para atualizar o formulário se os dados iniciais carregarem depois (caso de async)
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            if (isEditing) {
                // Chama a função de atualização do Context
                // Nota: O ID precisa estar dentro do formData para o backend saber quem atualizar
                await updatePessoa(formData);
            } else {
                // Fluxo normal de cadastro
                await addPessoa(formData);
            }

            // Se a página pai passou uma função de sucesso (ex: mostrar mensagem e redirecionar), usa ela.
            if (onSuccess) {
                onSuccess();
            } else {
                // Padrão antigo: redireciona direto
                navigate('/pessoas');
            }
        } catch (err) {
            setError(err.message || 'Ocorreu um erro ao salvar os dados. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 md:mb-8 rounded-lg shadow-sm flex items-start" role="alert">
                    <svg className="w-5 h-5 md:w-6 md:h-6 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <div className="text-sm">
                        <p className="font-bold">Erro no envio</p>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="col-span-1 md:col-span-2">
                    <FormInput label="Nome Completo" id="nomeCompleto" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} required />
                </div>
                <FormInput label="Data de Nascimento" id="dataNascimento" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} type="date" required />
                <FormInput label="Telefone" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} type="tel" required />
                <div className="col-span-1 md:col-span-2">
                    <FormInput label="E-mail" id="email" name="email" value={formData.email} onChange={handleChange} type="email" required />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <FormInput label="Endereço" id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="tipo" className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tipo</label>
                    <select name="tipo" id="tipo" value={formData.tipo} onChange={handleChange} className="block w-full px-4 py-3 md:px-5 md:py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all duration-300 shadow-sm appearance-none bg-no-repeat bg-right text-base">
                        <option value="Visitante">Visitante</option>
                        <option value="Membro">Membro</option>
                        <option value="Líder">Líder</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="ministerio" className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Ministério</label>
                    <select name="ministerio" id="ministerio" value={formData.ministerio} onChange={handleChange} className="block w-full px-4 py-3 md:px-5 md:py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all duration-300 shadow-sm appearance-none bg-no-repeat bg-right text-base">
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
                    <label htmlFor="observacoes" className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Observações</label>
                    <textarea name="observacoes" id="observacoes" value={formData.observacoes} onChange={handleChange} rows="4" className="block w-full px-4 py-3 md:px-5 md:py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all duration-300 shadow-sm resize-none text-base"></textarea>
                </div>
            </div>
            <div className="pt-6 md:pt-8">
                <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold uppercase tracking-widest text-xs py-3 md:py-4 px-6 md:px-8 rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0 flex justify-center items-center gap-2 min-h-[48px]">
                    {isSubmitting ? (<> <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processando...</> ) : (isEditing ? 'Salvar Alterações' : 'Cadastrar Pessoa')}
                </button>
            </div>
        </form>
    );
};

export default PessoaForm;