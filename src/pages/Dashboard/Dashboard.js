import React, { useContext } from 'react';
import { PessoaContext } from '../../contexts/PessoaContext';
import Card from '../../components/Card/Card';

const Dashboard = () => {
    const { pessoas, loading } = useContext(PessoaContext);

    if (loading) {
        return <div>Carregando...</div>;
    }

    const totalPessoas = pessoas.length;
    const totalMembros = pessoas.filter(p => p.tipo === 'Membro').length;
    const totalVisitantes = pessoas.filter(p => p.tipo === 'Visitante').length;
    const totalLideres = pessoas.filter(p => p.tipo === 'Líder').length;

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Total de Pessoas">
                    <p className="text-3xl font-bold text-azul-ibvrd">{totalPessoas}</p>
                </Card>
                <Card title="Membros">
                    <p className="text-3xl font-bold text-green-600">{totalMembros}</p>
                </Card>
                <Card title="Visitantes">
                    <p className="text-3xl font-bold text-yellow-600">{totalVisitantes}</p>
                </Card>
                <Card title="Líderes">
                    <p className="text-3xl font-bold text-purple-600">{totalLideres}</p>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;