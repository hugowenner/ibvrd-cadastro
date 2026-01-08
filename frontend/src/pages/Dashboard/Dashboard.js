// src/pages/Dashboard/Dashboard.js
import React, { useContext, useMemo } from 'react';
import { PessoaContext } from '../../contexts/PessoaContext';
import Card from '../../components/Card';

const Dashboard = () => {
    const { pessoas, loading, error } = useContext(PessoaContext);

    const estatisticas = useMemo(() => {
        // 🔒 Segurança: Garante que pessoas seja um array antes de calcular
        const lista = Array.isArray(pessoas) ? pessoas : [];

        const totalPessoas = lista.length;
        const totalMembros = lista.filter(p => p.tipo === 'Membro').length;
        const totalVisitantes = lista.filter(p => p.tipo === 'Visitante').length;
        const totalLideres = lista.filter(p => p.tipo === 'Líder').length;
        
        const mesAtual = new Date().getMonth();
        const aniversariantesMes = lista.filter(pessoa => {
            if (!pessoa.dataNascimento) return false;
            const mesAniversario = new Date(pessoa.dataNascimento).getMonth();
            return mesAniversario === mesAtual;
        }).length;
        
        return {
            totalPessoas,
            totalMembros,
            totalVisitantes,
            totalLideres,
            aniversariantesMes
        };
    }, [pessoas]);

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
                    Não foi possível carregar os dados do dashboard.
                </div>
            </Card>
        );
    }

    return (
        <div className="animate-fade-in px-2 md:px-0">
            <div className="mb-8 md:mb-12 pb-4 border-b border-gray-200">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 font-normal">Visão Geral</h2>
                <p className="text-gray-500 mt-2 font-light text-sm md:text-base">Resumo estatístico da comunidade.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
                <Card className="border-b-4 border-b-gray-800">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Total de Pessoas</p>
                    <p className="text-4xl md:text-5xl font-serif text-gray-900 font-bold mt-2">{estatisticas.totalPessoas}</p>
                </Card>
                <Card className="border-b-4 border-b-amber-600 bg-amber-50/30">
                    <p className="text-[10px] md:text-xs font-bold text-amber-700/70 uppercase tracking-widest">Membros</p>
                    <p className="text-4xl md:text-5xl font-serif text-amber-700 font-bold mt-2">{estatisticas.totalMembros}</p>
                </Card>
                <Card className="border-b-4 border-b-blue-500 bg-blue-50/30">
                    <p className="text-[10px] md:text-xs font-bold text-blue-600/70 uppercase tracking-widest">Visitantes</p>
                    <p className="text-4xl md:text-5xl font-serif text-blue-600 font-bold mt-2">{estatisticas.totalVisitantes}</p>
                </Card>
                <Card className="border-b-4 border-b-purple-500 bg-purple-50/30">
                    <p className="text-[10px] md:text-xs font-bold text-purple-600/70 uppercase tracking-widest">Líderes</p>
                    <p className="text-4xl md:text-5xl font-serif text-purple-600 font-bold mt-2">{estatisticas.totalLideres}</p>
                </Card>
                <Card className="border-b-4 border-b-pink-500 bg-pink-50/30 xl:col-span-1">
                    <p className="text-[10px] md:text-xs font-bold text-pink-600/70 uppercase tracking-widest">Aniversariantes</p>
                    <p className="text-4xl md:text-5xl font-serif text-pink-600 font-bold mt-2">{estatisticas.aniversariantesMes}</p>
                    <p className="text-[10px] md:text-xs text-pink-400/70 mt-2 uppercase tracking-widest font-medium">Este Mês</p>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;