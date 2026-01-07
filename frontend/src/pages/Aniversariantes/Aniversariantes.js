import React, { useContext, useState, useMemo } from 'react';
import { PessoaContext } from '../../contexts/PessoaContext';
import Card from '../../components/Card/Card';

const Aniversariantes = () => {
    const { pessoas, loading, error } = useContext(PessoaContext);
    
    // Estado para controlar o mês selecionado (0 a 11)
    // Inicializa com o mês atual
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const formatarData = (dataString) => {
        if (!dataString) return '';
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}`;
    };

    const aniversariantesDoMes = useMemo(() => {
        return pessoas.filter(pessoa => {
            if (!pessoa.dataNascimento) return false;
            const mesAniversario = new Date(pessoa.dataNascimento).getMonth();
            return mesAniversario === selectedMonth;
        }).sort((a, b) => {
            const diaA = new Date(a.dataNascimento).getDate();
            const diaB = new Date(b.dataNascimento).getDate();
            return diaA - diaB;
        });
    }, [pessoas, selectedMonth]);

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
                    <strong className="font-bold block mb-1">Erro:</strong> 
                    Não foi possível carregar os aniversariantes.
                </div>
            </Card>
        );
    }

    const nomeMesAtual = meses[selectedMonth];

    return (
        <div className="animate-fade-in px-2 md:px-0">
            <div className="mb-8 md:mb-12 pb-4 border-b border-gray-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="w-full md:w-auto">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 font-normal leading-tight">
                        Aniversariantes de <span className="font-bold text-amber-700">{nomeMesAtual}</span>
                    </h2>
                    <p className="text-gray-500 mt-2 font-light text-sm md:text-base">Celebrando a vida da nossa comunidade.</p>
                </div>
                
                {/* Filtro de Mês */}
                <div className="w-full md:w-64">
                    <label htmlFor="filtro-mes" className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Filtrar por Mês</label>
                    <select 
                        id="filtro-mes"
                        value={selectedMonth} 
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all duration-300 bg-gray-50 focus:bg-white appearance-none cursor-pointer text-sm shadow-sm"
                    >
                        {meses.map((mes, index) => (
                            <option key={index} value={index}>{mes}</option>
                        ))}
                    </select>
                </div>
            </div>

            {aniversariantesDoMes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {aniversariantesDoMes.map(pessoa => (
                        <Card key={pessoa.id} className="text-center hover:border-amber-300 group transform hover:-translate-y-1 transition-all duration-300">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-stone-50 to-stone-100 border-2 border-amber-600 rounded-full flex items-center justify-center text-gray-800 text-xl md:text-2xl font-serif font-bold mb-4 md:mb-6 shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                                    {pessoa.nomeCompleto.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                </div>
                                <h3 className="text-lg md:text-xl font-serif text-gray-900 mb-2 font-medium">{pessoa.nomeCompleto}</h3>
                                <p className="text-amber-700 font-serif font-bold mb-4 md:mb-6 text-base md:text-lg">
                                    {formatarData(pessoa.dataNascimento)}
                                </p>
                                <span className="inline-block bg-amber-50 text-amber-800 text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-amber-100 shadow-sm">
                                    {pessoa.tipo}
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="bg-stone-50 border-dashed border-2">
                    <p className="text-center text-gray-500 font-serif text-base md:text-xl">
                        Nenhuma pessoa fazendo aniversário em {nomeMesAtual}.
                    </p>
                </Card>
            )}
        </div>
    );
};

export default Aniversariantes;