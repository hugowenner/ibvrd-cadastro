import React, { useContext, useMemo } from 'react';
import { PessoaContext } from '../../contexts/PessoaContext';
import Card from '../../components/Card/Card';

const Aniversariantes = () => {
    const { pessoas, loading, error } = useContext(PessoaContext);

    const formatarData = (dataString) => {
        if (!dataString) return '';
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}`;
    };

    const aniversariantesDoMes = useMemo(() => {
        const mesAtual = new Date().getMonth();

        return pessoas.filter(pessoa => {
            if (!pessoa.dataNascimento) return false;
            const mesAniversario = new Date(pessoa.dataNascimento).getMonth();
            return mesAniversario === mesAtual;
        }).sort((a, b) => {
            const diaA = new Date(a.dataNascimento).getDate();
            const diaB = new Date(b.dataNascimento).getDate();
            return diaA - diaB;
        });
    }, [pessoas]);

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
                    <strong className="font-bold block mb-1">Erro:</strong> 
                    Não foi possível carregar os aniversariantes.
                </div>
            </Card>
        );
    }

    const nomeMesAtual = new Date().toLocaleString('pt-BR', { month: 'long' });

    return (
        <div className="animate-fade-in">
            <div className="mb-10 pb-4 border-b border-gray-200">
                <h2 className="text-3xl md:text-4xl font-serif text-gray-900 font-normal">
                    Aniversariantes de <span className="font-bold text-amber-700">{nomeMesAtual.charAt(0).toUpperCase() + nomeMesAtual.slice(1)}</span>
                </h2>
            </div>

            {aniversariantesDoMes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {aniversariantesDoMes.map(pessoa => (
                        <Card key={pessoa.id} className="text-center hover:border-amber-300 group">
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 bg-gray-50 border-2 border-amber-600 rounded-full flex items-center justify-center text-gray-800 text-2xl font-serif font-bold mb-6 transition-transform duration-300 group-hover:scale-105">
                                    {pessoa.nomeCompleto.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                </div>
                                <h3 className="text-xl font-serif text-gray-900 mb-1 font-medium">{pessoa.nomeCompleto}</h3>
                                <p className="text-gray-500 font-light mb-4 text-lg">
                                    {formatarData(pessoa.dataNascimento)}
                                </p>
                                <span className="inline-block bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded border border-amber-100">
                                    {pessoa.tipo}
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="bg-gray-50 border-dashed">
                    <p className="text-center text-gray-500 font-serif">
                        Nenhuma pessoa fazendo aniversário em {nomeMesAtual}.
                    </p>
                </Card>
            )}
        </div>
    );
};

export default Aniversariantes;