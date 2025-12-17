import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de tabela reutilizável e responsivo.
 * @param {object} props - As props do componente.
 * @param {Array<object>} props.data - Array de objetos com os dados a serem exibidos.
 * @param {Array<object>} props.columns - Configuração das colunas da tabela.
 * @param {boolean} [props.loading=false] - Indica se a tabela está em estado de carregamento.
 * @param {string} [props.emptyMessage="Nenhum registro encontrado"] - Mensagem exibida quando não há dados.
 */
const Table = ({ data, columns, loading = false, emptyMessage = 'Nenhum registro encontrado' }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-8 bg-white rounded-lg shadow-md">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-azul-ibvrd"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white shadow-md rounded-lg p-8 text-center text-gray-500 animate-pulse">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto shadow-md rounded-lg transition-all duration-300 hover:shadow-lg">
            <table className="min-w-full bg-white">
                <thead className="bg-azul-ibvrd text-white">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-200">
                            {columns.map((col) => (
                                <td key={col.key} className="py-4 px-4 text-sm text-gray-700">
                                    {typeof col.render === 'function' ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

Table.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            render: PropTypes.func, // Função opcional para renderizar customizado
        })
    ).isRequired,
    loading: PropTypes.bool,
    emptyMessage: PropTypes.string,
};

export default Table;