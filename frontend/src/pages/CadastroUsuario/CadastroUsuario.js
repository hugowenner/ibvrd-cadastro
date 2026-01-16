import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // ADICIONADO: Para checar permissão
import auth from '../../services/auth';
import Card from '../../components/Card';

const CadastroUsuario = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // ADICIONADO: Pega usuário atual
    
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'lider' // ADICIONADO: Campo para Nível
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validação simples de front
        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não conferem.');
            return;
        }
        if (formData.password.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres.');
            return;
        }

        setIsSubmitting(true);
        try {
            // ADICIONADO: Envia formData.role
            await auth.createUser(formData.nome, formData.email, formData.password, formData.role);
            setSuccess(true);
            setFormData({ nome: '', email: '', password: '', confirmPassword: '', role: 'lider' });
        } catch (err) {
            setError(err.message || 'Erro ao cadastrar usuário.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in pb-12 px-4 md:px-0">
            <div className="mb-8 pb-4 border-b border-gray-200">
                <h2 className="text-3xl font-serif text-gray-900">Novo Usuário</h2>
                <p className="text-gray-500 mt-2">
                    Crie contas de acesso para outros administradores ou líderes.
                </p>
            </div>

            <Card className="max-w-2xl mx-auto">
                {success ? (
                    <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg shadow-sm flex items-start">
                        <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <div>
                            <p className="font-bold">Sucesso!</p>
                            <p className="text-sm">Usuário cadastrado com sucesso.</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm flex items-start" role="alert">
                                <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <div className="text-sm">
                                    <p className="font-bold">Erro</p>
                                    <p>{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Nome */}
                        <div>
                            <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nome Completo</label>
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all duration-300 shadow-sm"
                                placeholder="Ex: João Silva"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email de Acesso</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all duration-300 shadow-sm"
                                placeholder="usuario@exemplo.com"
                            />
                        </div>

                        {/* Senha */}
                        <div>
                            <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Senha</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all duration-300 shadow-sm"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>

                        {/* Confirmar Senha */}
                        <div>
                            <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Confirmar Senha</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all duration-300 shadow-sm"
                                placeholder="Repita a senha"
                            />
                        </div>

                        {/* ADICIONADO: Campo de Nível de Acesso (Só Admin vê) */}
                        {user?.role === 'admin' && (
                            <div>
                                <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nível de Acesso</label>
                                <select 
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all duration-300 shadow-sm appearance-none bg-no-repeat bg-right text-base"
                                >
                                    <option value="lider">Lider / Secretaria</option>
                                    <option value="admin">Admin / Pastor</option>
                                </select>
                                <p className="text-[10px] text-gray-400 mt-1">
                                    Admins podem criar usuários. Líderes não podem.
                                </p>
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold uppercase tracking-widest text-xs py-3 px-6 rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0 flex justify-center items-center gap-2 min-h-[48px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processando...
                                    </>
                                ) : 'Criar Usuário'}
                            </button>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default CadastroUsuario;