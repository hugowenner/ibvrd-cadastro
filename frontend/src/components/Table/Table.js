import React from 'react';
import PropTypes from 'prop-types';

const Table = ({ data, columns, loading = false, emptyMessage = 'Nenhum registro encontrado' }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-24 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="relative w-12 h-12">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-100 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 md:p-16 text-center shadow-sm">
                <p className="text-gray-400 font-serif text-lg md:text-xl">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <>
            {/* MOBILE VIEW: CARDS */}
            <div className="block md:hidden space-y-4">
                {data.map((row) => (
                    <div key={row.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                        {/* Title (Assume first column is title or look for 'nomeCompleto') */}
                        <div className="mb-3 pb-2 border-b border-gray-100">
                            <h3 className="text-lg font-serif font-bold text-gray-900">
                                {columns[0].render ? columns[0].render(row[columns[0].key], row) : row[columns[0].key]}
                            </h3>
                        </div>
                        
                        {/* Details */}
                        <div className="space-y-2">
                            {columns.slice(1).map((col) => {
                                // Skip actions for the list body, handle separately
                                if (col.key === 'acoes') return null;
                                const value = typeof col.render === 'function' ? col.render(row[col.key], row) : row[col.key];
                                if (!value) return null; // Skip empty values

                                return (
                                    <div key={col.key} className="flex justify-between items-center text-sm">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{col.label}</span>
                                        <span className="text-gray-700 font-medium text-right truncate max-w-[60%]">{value}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Actions at bottom */}
                        {columns.find(c => c.key === 'acoes') && (
                            <div className="mt-4 pt-3 border-t border-gray-100 flex gap-4 justify-end">
                                {columns.find(c => c.key === 'acoes').render(null, row)}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* DESKTOP VIEW: TABLE */}
            <div className="hidden md:block overflow-hidden bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                {columns.map((col) => (
                                    <th key={col.key} className="py-5 px-8 text-xs font-bold text-gray-500 uppercase tracking-widest font-serif">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data.map((row) => (
                                <tr key={row.id} className="hover:bg-amber-50/40 transition-colors duration-200 group">
                                    {columns.map((col) => (
                                        <td key={col.key} className="py-4 px-8 text-sm text-gray-700 font-medium font-sans">
                                            {typeof col.render === 'function' ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
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