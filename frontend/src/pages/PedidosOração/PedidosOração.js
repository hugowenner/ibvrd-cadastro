import React, { useState, useContext, useEffect } from 'react';
import { FaPrayingHands, FaCheck, FaTrashAlt, FaRegPaperPlane } from 'react-icons/fa';
import { useOração } from '../../contexts/OraçãoContext';
import { PessoaContext } from '../../contexts/PessoaContext'; // Para pegar a lista de pessoas no select
import Card from '../../components/Card';

const PedidosOração = () => {
    const { pedidos, loading, error, addPedido, updateStatus, deletePedido } = useOração();
    const { pessoas } = useContext(PessoaContext); // Lista para o select
    const [filter, setFilter] = useState('aberto'); // Filtro inicial: Mostrar só abertos
    const [modalOpen, setModalOpen] = useState(false);

    // Estado do Formulário
    const [formData, setFormData] = useState({
        pessoa_id: '',
        descricao: '',
        urgencia: 'media'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addPedido(formData);
        setModalOpen(false);
        setFormData({ pessoa_id: '', descricao: '', urgencia: 'media' });
    };

    const handleWhatsApp = (pedido) => {
        const nome = pedido.nomeCompleto || 'Irmão(ã)';
        const desc = pedido.descricao;
        const urgencia = pedido.urgencia.toUpperCase();
        
        const texto = `⛪ *Pedido de Oração - IBVRD*\n\n❤️ *Nome:* ${nome}\n🙏 *Pedido:* ${desc}\n🔴 *Urgência:* ${urgencia}\n\nVamos orar!`;
        window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
    };

    const pedidosFiltrados = pedidos.filter(p => filter === 'todos' ? true : p.status === filter);

    // Helper de cores
    const getUrgencyColor = (u) => {
        if (u === 'alta') return 'border-red-500 bg-red-50 text-red-700';
        if (u === 'media') return 'border-amber-500 bg-amber-50 text-amber-700';
        return 'border-blue-300 bg-blue-50 text-blue-700';
    };

    return (
        <div className="animate-fade-in px-2 md:px-0">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif text-gray-900">Mural de Oração</h2>
                    <p className="text-gray-500">Intercedendo uns pelos outros.</p>
                </div>
                <button 
                    onClick={() => setModalOpen(true)}
                    className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold shadow hover:bg-amber-700 transition-colors"
                >
                    + Novo Pedido
                </button>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['aberto', 'orado', 'respondido', 'todos'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${filter === status ? 'bg-gray-800 text-white' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}
                    >
                        {status === 'todos' ? 'Todos' : status}
                    </button>
                ))}
            </div>

            {/* Lista */}
            {loading ? <p>Carregando...</p> : pedidosFiltrados.length === 0 ? (
                <Card className="text-center py-12 text-gray-400">Nenhum pedido encontrado.</Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pedidosFiltrados.map(pedido => (
                        <Card key={pedido.id} className={`relative overflow-hidden border-l-4 ${getUrgencyColor(pedido.urgencia)}`}>
                            
                            {/* Cabeçalho do Card */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">{pedido.nomeCompleto}</h3>
                                    <span className="text-xs uppercase font-bold opacity-75">{pedido.urgencia}</span>
                                </div>
                                {pedido.status === 'aberto' && (
                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded">Aberto</span>
                                )}
                            </div>

                            {/* Descrição */}
                            <p className="text-sm md:text-base mb-6 font-light leading-relaxed italic">
                                "{pedido.descricao}"
                            </p>

                            {/* Ações */}
                            <div className="flex gap-3 border-t border-black/10 pt-3">
                                {/* Botão WhatsApp */}
                                <button 
                                    onClick={() => handleWhatsApp(pedido)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                                >
                                    <FaRegPaperPlane /> Compartilhar
                                </button>
                                
                                {/* Botão Orado (se aberto) */}
                                {pedido.status === 'aberto' && (
                                    <button 
                                        onClick={() => updateStatus(pedido.id, 'orado')}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm transition-colors"
                                    >
                                        <FaCheck /> Orar
                                    </button>
                                )}

                                {/* Botão Excluir (Admin) */}
                                <button 
                                    onClick={() => deletePedido(pedido.id)}
                                    className="px-3 text-red-400 hover:text-red-600 transition-colors"
                                    title="Remover"
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal de Adicionar Pedido */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <Card className="w-full max-w-md animate-fade-in-up">
                        <h3 className="text-2xl font-serif mb-4">Novo Pedido de Oração</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pessoa</label>
                                <select 
                                    required
                                    value={formData.pessoa_id}
                                    onChange={e => setFormData({...formData, pessoa_id: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl bg-white"
                                >
                                    <option value="">Selecione...</option>
                                    {pessoas.map(p => (
                                        <option key={p.id} value={p.id}>{p.nomeCompleto}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Urgência</label>
                                <select 
                                    value={formData.urgencia}
                                    onChange={e => setFormData({...formData, urgencia: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl bg-white"
                                >
                                    <option value="baixa">Baixa</option>
                                    <option value="media">Média</option>
                                    <option value="alta">Alta</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pedido</label>
                                <textarea 
                                    required
                                    rows="3"
                                    value={formData.descricao}
                                    onChange={e => setFormData({...formData, descricao: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl bg-white"
                                    placeholder="Descreva o pedido de oração..."
                                ></textarea>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold">Cancelar</button>
                                <button type="submit" className="flex-1 py-3 bg-amber-600 text-white rounded-xl font-bold">Salvar</button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default PedidosOração;