import React, { useContext, useState, useMemo } from 'react';
import { PessoaContext } from '../../contexts/PessoaContext';
import Table from '../../components/Table/Table';

const Pessoas = () => {
    const { pessoas, loading } = useContext(PessoaContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('Todos');

    const columns = [
        { key: 'nomeCompleto', label: 'Nome' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'ministerio', label: 'Ministério' },
        { key: 'telefone', label: 'Telefone' },
        { key: 'dataCadastro', label: 'Data de Cadastro' },
    ];

    const filteredPessoas = useMemo(() => {
        return pessoas.filter(pessoa => {
            const matchesSearch = pessoa.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterType === 'Todos' || pessoa.tipo === filterType;
            return matchesSearch && matchesFilter;
        });
    }, [pessoas, searchTerm, filterType]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Pessoas Cadastradas</h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Buscar por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd"
                />
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd"
                >
                    <option value="Todos">Todos</option>
                    <option value="Visitante">Visitante</option>
                    <option value="Membro">Membro</option>
                    <option value="Líder">Líder</option>
                </select>
            </div>
            <Table data={filteredPessoas} columns={columns} />
        </div>
    );
};

export default Pessoas;