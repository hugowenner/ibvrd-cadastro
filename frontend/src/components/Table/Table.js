import React from 'react';
import PropTypes from 'prop-types';

const Table = ({ data, columns, loading = false, emptyMessage = 'Nenhum registro encontrado' }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-12 text-center">
                <p className="text-gray-500 font-serif text-lg">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            {columns.map((col) => (
                                <th key={col.key} className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider font-serif">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-amber-50 transition-colors duration-200 group">
                                {columns.map((col) => (
                                    <td key={col.key} className="py-4 px-6 text-sm text-gray-700 font-light">
                                        {typeof col.render === 'function' ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

Table.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            render: PropTypes.func,
        })
    ).isRequired,
    loading: PropTypes.bool,
    emptyMessage: PropTypes.string,
};

export default Table;