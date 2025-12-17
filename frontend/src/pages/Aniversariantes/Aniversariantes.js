import React, { useContext, useMemo } from 'react';
import { PessoaContext } from '../../contexts/PessoaContext';
import Card from '../../components/Card/Card';

const Aniversariantes = () => {
    const { pessoas, loading, error } = useContext(PessoaContext);

    // Função para formatar a data de nascimento para um formato mais amigável
    const formatarData = (dataString) => {
        if (!dataString) return '';
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}`;
    };

    // useMemo para filtrar os aniversariantes do mês atual
    const aniversariantesDoMes = useMemo(() => {
        const mesAtual = new Date().getMonth(); // getMonth() retorna 0 para Janeiro, 11 para Dezembro

        return pessoas.filter(pessoa => {
            if (!pessoa.dataNascimento) return false;
            const mesAniversario = new Date(pessoa.dataNascimento).getMonth();
            return mesAniversario === mesAtual;
        }).sort((a, b) => {
            // Ordenar por dia do aniversário
            const diaA = new Date(a.dataNascimento).getDate();
            const diaB = new Date(b.dataNascimento).getDate();
            return diaA - diaB;
        });
    }, [pessoas]); // Recalcula apenas quando a lista de pessoas mudar

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
                    <strong>Erro:</strong> Não foi possível carregar os aniversariantes. Tente novamente mais tarde.
                </div>
            </Card>
        );
    }

    const nomeMesAtual = new Date().toLocaleString('pt-BR', { month: 'long' });

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Aniversariantes de {nomeMesAtual.charAt(0).toUpperCase() + nomeMesAtual.slice(1)}
            </h2>

            {aniversariantesDoMes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
                    {aniversariantesDoMes.map(pessoa => (
                        <Card key={pessoa.id} className="text-center" role="listitem">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-azul-ibvrd rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 transition-transform duration-300 hover:scale-110" aria-label={`Iniciais de ${pessoa.nomeCompleto}`}>
                                    {pessoa.nomeCompleto.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">{pessoa.nomeCompleto}</h3>
                                <p className="text-gray-600" aria-label={`Data de aniversário: ${formatarData(pessoa.dataNascimento)}`}>
                                    {formatarData(pessoa.dataNascimento)}
                                </p>
                                <span className="mt-2 inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded transition-colors duration-200 hover:bg-green-200">
                                    {pessoa.tipo}
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <p className="text-center text-gray-500">
                        Nenhuma pessoa fazendo aniversário em {nomeMesAtual}.
                    </p>
                </Card>
            )}
        </div>
    );
};

export default Aniversariantes;