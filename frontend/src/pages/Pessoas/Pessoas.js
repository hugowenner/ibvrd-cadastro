import React, { useContext, useState, useMemo } from 'react';
import { PessoaContext } from '../../contexts/PessoaContext';
import Table from '../../components/Table';
import Card from '../../components/Card';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';

const Pessoas = () => {
    const { pessoas, loading, error, deletePessoa } = useContext(PessoaContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('Todos');
    const [sortConfig, setSortConfig] = useState({
        key: 'nomeCompleto',
        direction: 'ascending'
    });

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
            key: 'ministerios',
            label: 'Ministério',
            sortable: true,
            render: (value) =>
                Array.isArray(value) && value.length > 0
                    ? value[0]
                    : '—'
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
            render: (value) =>
                value
                    ? new Date(value).toLocaleDateString('pt-BR')
                    : 'N/A'
        },
        {
            key: 'acoes',
            label: 'Ações',
            sortable: false,
            render: (_, row) => (
                <div className="flex gap-4 md:space-x-6">
                    <button
                        onClick={() => navigate(`/editar/${row.id}`)}
                        className="text-amber-700 font-bold hover:text-amber-900 uppercase text-xs"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDelete(row.id, row.nomeCompleto)}
                        className="text-red-500 font-bold hover:text-red-700 uppercase text-xs"
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
        const term = searchTerm.trim().toLowerCase();

        let filtered = pessoas.filter(pessoa => {
            const nome = (pessoa.nomeCompleto || '').toLowerCase();
            const email = (pessoa.email || '').toLowerCase();
            const telefone = (pessoa.telefone || '').toLowerCase();

            const matchesSearch =
                term === '' ||
                nome.includes(term) ||
                email.includes(term) ||
                telefone.includes(term);

            const matchesFilter =
                filterType === 'Todos' || pessoa.tipo === filterType;

            return matchesSearch && matchesFilter;
        });

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key] ?? '';
                const bValue = b[sortConfig.key] ?? '';
                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [pessoas, searchTerm, filterType, sortConfig]);

    if (loading) {
        return <div className="text-center py-10">Carregando...</div>;
    }

    if (error) {
        return (
            <Card className="border-l-4 border-l-red-500 bg-red-50">
                <div className="text-red-700 text-sm">
                    <strong>Erro:</strong> Não foi possível carregar a lista.
                </div>
            </Card>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
                <h2 className="text-3xl">Pessoas Cadastradas</h2>
            </div>

            {/* BARRA DE FILTROS */}
            <Card className="mb-6 p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    {/* Busca */}
                    <div className="md:col-span-7">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                            Buscar
                        </label>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Nome, email ou telefone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-sm bg-gray-50 focus:bg-white"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                    aria-label="Limpar busca"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filtro Tipo */}
                    <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                            Tipo
                        </label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm appearance-none cursor-pointer"
                        >
                            <option value="Todos">Todos</option>
                            <option value="Visitante">Visitante</option>
                            <option value="Membro">Membro</option>
                            <option value="Líder">Líder</option>
                        </select>
                    </div>

                    {/* Limpar tudo */}
                    <div className="md:col-span-2 flex md:justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm('');
                                setFilterType('Todos');
                            }}
                            className="w-full md:w-auto px-5 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                        >
                            Limpar
                        </button>
                    </div>
                </div>
            </Card>

            <Table
                data={filteredPessoas}
                columns={columns}
                onSort={requestSort}
                sortConfig={sortConfig}
                emptyMessage="Nenhuma pessoa encontrada."
            />
        </div>
    );
};

export default Pessoas;