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
                <div className="flex gap-4 md:space-x-6">
                    <button
                        onClick={() => navigate(`/editar/${row.id}`)}
                        className="text-amber-700 font-bold hover:text-amber-900 transition-colors duration-200 uppercase text-[10px] md:text-xs tracking-widest flex items-center gap-1 min-h-[24px] md:min-auto"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDelete(row.id, row.nomeCompleto)}
                        className="text-red-500 font-bold hover:text-red-700 transition-colors duration-200 uppercase text-[10px] md:text-xs tracking-widest flex items-center gap-1 min-h-[24px] md:min-auto"
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
                <div className="relative w-12 h-12">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-100 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-l-4 border-l-red-500 bg-red-50">
                <div className="text-red-700 font-serif text-sm">
                    <strong className="font-bold block">Erro:</strong> 
                    Não foi possível carregar a lista de pessoas.
                </div>
            </Card>
        );
    }

    return (
        <div className="animate-fade-in px-2 md:px-0">
            <div className="mb-8 md:mb-12 pb-4 border-b border-gray-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 font-normal">Pessoas Cadastradas</h2>
                    <p className="text-gray-500 mt-2 font-light text-sm md:text-base">Gerencie os membros e visitantes da comunidade.</p>
                </div>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100 mb-6 md:mb-8 flex flex-col gap-4 md:flex-row md:gap-6 items-center">
                <div className="relative w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all duration-300 bg-gray-50 focus:bg-white text-sm"
                    />
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400 absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <div className="w-full md:w-auto">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all duration-300 bg-gray-50 focus:bg-white appearance-none cursor-pointer text-sm"
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