import React, { useContext, useState, useMemo } from 'react';
import { PessoaContext } from '../../contexts/PessoaContext';
import Table from '../../components/Table/Table';
import Card from '../../components/Card/Card';
import { useNavigate } from 'react-router-dom';

const Pessoas = () => {
    const { pessoas, loading, error, deletePessoa } = useContext(PessoaContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('Todos');
    const [sortConfig, setSortConfig] = useState({ key: 'nomeCompleto', direction: 'ascending' });
    const navigate = useNavigate();

    const columns = [
        { 
            key: 'nomeCompleto', 
            label: 'Nome',
            sortable: true
        },
        { 
            key: 'tipo', 
            label: 'Tipo',
            sortable: true
        },
        { 
            key: 'ministerio', 
            label: 'Ministério',
            sortable: true
        },
        { 
            key: 'telefone', 
            label: 'Telefone',
            sortable: false
        }, 
        { 
            key: 'dataCadastro', 
            label: 'Data de Cadastro',
            sortable: true,
            render: (value) => value ? new Date(value).toLocaleDateString('pt-BR') : 'N/A'
        },
        {
            key: 'acoes',
            label: 'Ações',
            sortable: false,
            render: (_, row) => (
                <div className="flex space-x-4">
                    <button
                        onClick={() => navigate(`/editar/${row.id}`)}
                        className="text-amber-700 font-medium hover:text-amber-900 transition-colors duration-200 uppercase text-xs tracking-wider hover:underline"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDelete(row.id, row.nomeCompleto)}
                        className="text-red-600 font-medium hover:text-red-800 transition-colors duration-200 uppercase text-xs tracking-wider hover:underline"
                    >
                        Excluir
                    </button>
                </div>
            )
        }
    ];

    const handleDelete = async (id, nome) => {
        if (window.confirm(`Tem certeza que deseja excluir ${nome}?`)) {
            try {
                await deletePessoa(id);
            } catch (error) {
                alert('Erro ao excluir pessoa: ' + error.message);
            }
        }
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredPessoas = useMemo(() => {
        let filtered = pessoas.filter(pessoa => {
            const matchesSearch = pessoa.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterType === 'Todos' || pessoa.tipo === filterType;
            return matchesSearch && matchesFilter;
        });

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                
                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [pessoas, searchTerm, filterType, sortConfig]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-l-4 border-l-red-500">
                <div className="text-red-700">
                    <strong className="font-bold block">Erro:</strong> 
                    Não foi possível carregar a lista de pessoas.
                </div>
            </Card>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="mb-10 pb-4 border-b border-gray-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-serif text-gray-900 font-normal">Pessoas Cadastradas</h2>
                    <p className="text-gray-500 mt-2 font-light">Gerencie os membros e visitantes da comunidade.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8 flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative w-full sm:w-1/2">
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 transition-colors duration-200"
                    />
                </div>
                <div className="w-full sm:w-auto">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 transition-colors duration-200 bg-white"
                    >
                        <option value="Todos">Todos os Tipos</option>
                        <option value="Visitante">Visitante</option>
                        <option value="Membro">Membro</option>
                        <option value="Líder">Líder</option>
                    </select>
                </div>
            </div>

            <Table 
                data={filteredPessoas} 
                columns={columns} 
                onSort={requestSort}
                sortConfig={sortConfig}
                emptyMessage="Nenhuma pessoa encontrada com os filtros selecionados."
            />
        </div>
    );
};

export default Pessoas;