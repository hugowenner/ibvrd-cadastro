import React from 'react';

const Table = ({ data, columns }) => {
    return (
        <div className="overflow-x-auto shadow-md rounded-lg">
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
                        <tr key={row.id} className="hover:bg-gray-50">
                            {columns.map((col) => (
                                <td key={col.key} className="py-4 px-4 text-sm text-gray-700">
                                    {row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;