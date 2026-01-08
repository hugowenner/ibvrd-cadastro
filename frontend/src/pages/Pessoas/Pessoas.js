import React, { useContext, useState, useMemo } from 'react';
import { PessoaContext } from '../../contexts/PessoaContext';
import Table from '../../components/Table';
import Card from '../../components/Card';
import { useNavigate } from 'react-router-dom';

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
        let filtered = pessoas.filter(pessoa => {
            const matchesSearch =
                pessoa.nomeCompleto?.toLowerCase().includes(searchTerm.toLowerCase());
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
        <div>
            <h2 className="text-3xl mb-4">Pessoas Cadastradas</h2>

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
