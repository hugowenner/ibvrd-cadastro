import React, { useContext, useMemo } from 'react';
import { PessoaContext } from '../../contexts/PessoaContext';
import Card from '../../components/Card/Card';

const Dashboard = () => {
    const { pessoas, loading, error } = useContext(PessoaContext);

    const estatisticas = useMemo(() => {
        const totalPessoas = pessoas.length;
        const totalMembros = pessoas.filter(p => p.tipo === 'Membro').length;
        const totalVisitantes = pessoas.filter(p => p.tipo === 'Visitante').length;
        const totalLideres = pessoas.filter(p => p.tipo === 'Líder').length;
        
        const mesAtual = new Date().getMonth();
        const aniversariantesMes = pessoas.filter(pessoa => {
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-l-4 border-l-red-500">
                <div className="text-red-700">
                    <strong className="font-bold block">Erro:</strong> 
                    Não foi possível carregar os dados do dashboard.
                </div>
            </Card>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="mb-10 pb-4 border-b border-gray-200">
                <h2 className="text-3xl md:text-4xl font-serif text-gray-900 font-normal">Visão Geral</h2>
                <p className="text-gray-500 mt-2 font-light">Resumo estatístico da comunidade.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                <Card title="Total de Pessoas">
                    <p className="text-4xl font-serif text-gray-800 font-bold mt-2">{estatisticas.totalPessoas}</p>
                </Card>
                <Card title="Membros">
                    <p className="text-4xl font-serif text-amber-700 font-bold mt-2">{estatisticas.totalMembros}</p>
                </Card>
                <Card title="Visitantes">
                    <p className="text-4xl font-serif text-blue-600 font-bold mt-2">{estatisticas.totalVisitantes}</p>
                </Card>
                <Card title="Líderes">
                    <p className="text-4xl font-serif text-purple-700 font-bold mt-2">{estatisticas.totalLideres}</p>
                </Card>
                <Card title="Aniversariantes" className="xl:col-span-1">
                    <p className="text-4xl font-serif text-pink-600 font-bold mt-2">{estatisticas.aniversariantesMes}</p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Este Mês</p>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;