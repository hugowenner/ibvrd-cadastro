import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { PessoaContext } from '../../contexts/PessoaContext';

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addPessoa(formData);
            alert('Pessoa cadastrada com sucesso!');
            navigate('/pessoas'); // Redireciona para a lista de pessoas
        } catch (error) {
            alert('Ocorreu um erro ao cadastrar a pessoa.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                <input type="text" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                    <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                    <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Endereço</label>
                <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                    <select name="tipo" value={formData.tipo} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm">
                        <option value="Visitante">Visitante</option>
                        <option value="Membro">Membro</option>
                        <option value="Líder">Líder</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ministério</label>
                    <select name="ministerio" value={formData.ministerio} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm">
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
                <label className="block text-sm font-medium text-gray-700">Observações</label>
                <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm"></textarea>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-azul-ibvrd text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-400">
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar Pessoa'}
            </button>
        </form>
    );
};

export default PessoaForm;