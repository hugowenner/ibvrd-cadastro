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
                <div className="flex space-x-2">
                    <button
                        onClick={() => navigate(`/editar/${row.id}`)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline"
                        aria-label={`Editar ${row.nomeCompleto}`}
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDelete(row.id, row.nomeCompleto)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200 hover:underline"
                        aria-label={`Excluir ${row.nomeCompleto}`}
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
                // Opcional: mostrar mensagem de sucesso
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

    // useMemo para filtrar e ordenar pessoas
    const filteredPessoas = useMemo(() => {
        let filtered = pessoas.filter(pessoa => {
            const matchesSearch = pessoa.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterType === 'Todos' || pessoa.tipo === filterType;
            return matchesSearch && matchesFilter;
        });

        // Aplicar ordenação
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azul-ibvrd"></div>
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded animate-pulse">
                    <strong>Erro:</strong> Não foi possível carregar a lista de pessoas. Tente novamente mais tarde.
                </div>
            </Card>
        );
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
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd transition-all duration-200 focus:ring-2"
                    aria-label="Buscar por nome"
                />
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd transition-all duration-200 focus:ring-2"
                    aria-label="Filtrar por tipo"
                >
                    <option value="Todos">Todos</option>
                    <option value="Visitante">Visitante</option>
                    <option value="Membro">Membro</option>
                    <option value="Líder">Líder</option>
                </select>
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