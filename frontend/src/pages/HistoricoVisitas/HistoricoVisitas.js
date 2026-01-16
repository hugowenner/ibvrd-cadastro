import React, { useState, useContext } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useVisita } from '../../contexts/VisitaContext';
import { PessoaContext } from '../../contexts/PessoaContext';
import Card from '../../components/Card';

const HistoricoVisitas = () => {
    const { visitas, loading, error, addVisita, deleteVisita } = useVisita();
    const { pessoas } = useContext(PessoaContext);
    
    const [modalOpen, setModalOpen] = useState(false);

    // Estado do Formulário
    const [formData, setFormData] = useState({
        pessoa_id: '',
        data_visita: new Date().toISOString().split('T')[0], // Hoje por padrão
        motivo: '',
        observacoes: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addVisita(formData);
        setModalOpen(false);
        setFormData({ ...formData, motivo: '', observacoes: '' }); // Reseta motivo/obs mas mantem a pessoa
    };

    const formatData = (dateString) => {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    return (
        <div className="animate-fade-in px-2 md:px-0">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif text-gray-900">Histórico de Visitas</h2>
                    <p className="text-gray-500">Registro de acompanhamento pastoral.</p>
                </div>
                <button 
                    onClick={() => setModalOpen(true)}
                    className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold shadow hover:bg-amber-700 transition-colors flex items-center gap-2"
                >
                    <FaPlus /> Nova Visita
                </button>
            </div>

            {/* Lista / Timeline */}
            {loading ? <p className="text-center text-gray-500 py-10">Carregando histórico...</p> : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : visitas.length === 0 ? (
                <Card className="text-center py-12 text-gray-400 border-dashed border-2">
                    Nenhuma visita registrada ainda.
                </Card>
            ) : (
                <div className="max-w-4xl mx-auto relative">
                    {/* Linha vertical da timeline */}
                    <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gray-200 ml-4 md:ml-3"></div>

                    <div className="space-y-8">
                        {visitas.map((visita, index) => (
                            <div key={visita.id} className="relative pl-12 md:pl-20">
                                {/* Ponto na Timeline */}
                                <div className="absolute left-0 top-1 w-8 h-8 md:w-9 md:h-9 bg-amber-100 border-2 border-amber-600 rounded-full flex items-center justify-center text-amber-600 shadow-md z-10">
                                    <FaCalendarAlt className="text-sm" />
                                </div>

                                <Card className="relative shadow-md hover:shadow-lg transition-shadow">
                                    {/* Cabeçalho da Visita */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{visita.nomeCompleto}</h3>
                                            <span className="text-xs font-bold uppercase text-amber-700 bg-amber-50 px-2 py-1 rounded">
                                                {visita.motivo}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-medium text-gray-600 block">
                                                {formatData(visita.data_visita)}
                                            </span>
                                            <span className="text-xs text-gray-400">Data da Visita</span>
                                        </div>
                                    </div>

                                    {/* Conteúdo */}
                                    {visita.observacoes && (
                                        <div className="bg-stone-50 p-3 rounded-lg text-sm text-gray-700 leading-relaxed border border-stone-100">
                                            {visita.observacoes}
                                        </div>
                                    )}

                                    {/* Ações (Excluir) */}
                                    <button 
                                        onClick={() => deleteVisita(visita.id)}
                                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                                        title="Remover registro"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal Adicionar Visita */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <Card className="w-full max-w-md animate-fade-in-up">
                        <h3 className="text-2xl font-serif mb-4">Nova Visita Pastoral</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quem foi visitado?</label>
                                <select 
                                    required
                                    value={formData.pessoa_id}
                                    onChange={e => setFormData({...formData, pessoa_id: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl bg-white"
                                >
                                    <option value="">Selecione a pessoa...</option>
                                    {pessoas.map(p => (
                                        <option key={p.id} value={p.id}>{p.nomeCompleto}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data</label>
                                    <input 
                                        type="date"
                                        required
                                        value={formData.data_visita}
                                        onChange={e => setFormData({...formData, data_visita: e.target.value})}
                                        className="w-full p-3 border border-gray-200 rounded-xl bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Motivo</label>
                                    <input 
                                        type="text"
                                        required
                                        placeholder="Ex: Enfermidade"
                                        value={formData.motivo}
                                        onChange={e => setFormData({...formData, motivo: e.target.value})}
                                        className="w-full p-3 border border-gray-200 rounded-xl bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Observações</label>
                                <textarea 
                                    rows="3"
                                    value={formData.observacoes}
                                    onChange={e => setFormData({...formData, observacoes: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl bg-white"
                                    placeholder="Detalhes da conversa ou do estado da pessoa..."
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

export default HistoricoVisitas;