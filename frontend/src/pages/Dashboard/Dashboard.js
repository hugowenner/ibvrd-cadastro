import React, { useContext, useMemo } from 'react';
import { PessoaContext } from '../../contexts/PessoaContext';
import Card from '../../components/Card/Card';

const Dashboard = () => {
    const { pessoas, loading, error } = useContext(PessoaContext);

    // CORREÇÃO: useMemo movido para o topo, antes de qualquer lógica condicional
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azul-ibvrd"></div>
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded animate-pulse">
                    <strong>Erro:</strong> Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.
                </div>
            </Card>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                <Card title="Total de Pessoas" aria-label={`Total de ${estatisticas.totalPessoas} pessoas cadastradas`}>
                    <p className="text-3xl font-bold text-azul-ibvrd transition-transform duration-300 hover:scale-110">{estatisticas.totalPessoas}</p>
                </Card>
                <Card title="Membros" aria-label={`${estatisticas.totalMembros} membros cadastrados`}>
                    <p className="text-3xl font-bold text-green-600 transition-transform duration-300 hover:scale-110">{estatisticas.totalMembros}</p>
                </Card>
                <Card title="Visitantes" aria-label={`${estatisticas.totalVisitantes} visitantes cadastrados`}>
                    <p className="text-3xl font-bold text-yellow-600 transition-transform duration-300 hover:scale-110">{estatisticas.totalVisitantes}</p>
                </Card>
                <Card title="Líderes" aria-label={`${estatisticas.totalLideres} líderes cadastrados`}>
                    <p className="text-3xl font-bold text-purple-600 transition-transform duration-300 hover:scale-110">{estatisticas.totalLideres}</p>
                </Card>
                <Card title="Aniversariantes do Mês" aria-label={`${estatisticas.aniversariantesMes} pessoas fazem aniversário este mês`}>
                    <p className="text-3xl font-bold text-pink-600 transition-transform duration-300 hover:scale-110">{estatisticas.aniversariantesMes}</p>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;