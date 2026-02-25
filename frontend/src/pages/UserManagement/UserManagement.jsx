// src/pages/UserManagement/UserManagement.jsx
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';
import Table from '../../components/Table';
import Card from '../../components/Card';
import { 
    FaSearch, 
    FaFilter, 
    FaSort, 
    FaEdit, 
    FaTrash, 
    FaLock, 
    FaPowerOff, 
    FaCheck,
    FaTimes,
    FaUserShield
} from 'react-icons/fa';

const UserManagement = () => {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    
    // Estados de Dados
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados de Filtro e Busca
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'asc' });

    // Estados de UI (Modais e Toasts)
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
    const [editModal, setEditModal] = useState({ isOpen: false, user: null, newRole: '' });

    // Verificação de permissão (Admin)
    const isAdmin = currentUser?.role === 'admin';

    // 1. Carregar Usuários
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.listUsers();
            setUsers(data);
        } catch (err) {
            setError('Falha ao carregar usuários');
            showToast('Erro ao carregar lista.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // 2. Lógica de Filtragem e Ordenação
    const processedUsers = useMemo(() => {
        let filtered = users.filter(user => {
            const matchesSearch = user.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = filterRole === 'all' || user.role === filterRole;
            const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
            return matchesSearch && matchesRole && matchesStatus;
        });

        // Ordenação
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let valA = a[sortConfig.key];
                let valB = b[sortConfig.key];
                
                // Tratamento especial para strings case-insensitive
                if (typeof valA === 'string') valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();

                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [users, searchTerm, filterRole, filterStatus, sortConfig]);

    // 3. Handlers de Ações
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const checkPermission = (actionCallback) => {
        if (!isAdmin) {
            showToast('Ação disponível apenas para Administradores.', 'error');
            return;
        }
        actionCallback();
    };

    const handleToggleStatus = (user) => {
        checkPermission(async () => {
            try {
                await userService.toggleUserStatus(user.id, user.status);
                // Atualização otimista: inverte status localmente
                setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === 'ativo' ? 'inativo' : 'ativo' } : u));
                showToast(`Status de ${user.nome} alterado.`, 'success');
            } catch (e) {
                showToast('Erro ao alterar status.', 'error');
            }
        });
    };

    const handleResetPassword = (user) => {
        checkPermission(async () => {
            try {
                await userService.resetUserPassword(user.id);
                showToast(`Email de reset enviado para ${user.email}.`, 'success');
            } catch (e) {
                showToast('Erro ao solicitar reset de senha.', 'error');
            }
        });
    };

    const confirmDelete = () => {
        checkPermission(async () => {
            try {
                await userService.deleteUser(deleteModal.user.id);
                setUsers(prev => prev.filter(u => u.id !== deleteModal.user.id));
                setDeleteModal({ isOpen: false, user: null });
                showToast('Usuário excluído com sucesso.', 'success');
            } catch (e) {
                showToast('Erro ao excluir usuário.', 'error');
            }
        });
    };

    const saveRoleEdit = async () => {
        try {
            await userService.updateUser(editModal.user.id, { role: editModal.newRole });
            setUsers(prev => prev.map(u => u.id === editModal.user.id ? { ...u, role: editModal.newRole } : u));
            setEditModal({ isOpen: false, user: null, newRole: '' });
            showToast('Nível de acesso atualizado.', 'success');
        } catch (e) {
            showToast('Erro ao atualizar usuário.', 'error');
        }
    };

    // Helpers de UI
    const showToast = (message, type = 'success') => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    };

    const getRoleBadge = (role) => {
        const styles = {
            admin: 'bg-purple-100 text-purple-800 border-purple-200',
            lider: 'bg-amber-100 text-amber-800 border-amber-200',
            secretaria: 'bg-blue-100 text-blue-800 border-blue-200'
        };
        const labels = { admin: 'Admin', lider: 'Líder', secretaria: 'Secretaria' };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${styles[role] || styles.lider} uppercase tracking-wider`}>
                {labels[role] || role}
            </span>
        );
    };

    const getStatusBadge = (status) => {
        return status === 'ativo' 
            ? <span className="flex items-center gap-1 text-green-700 text-xs font-bold bg-green-50 px-2 py-1 rounded border border-green-200"><FaCheck /> Ativo</span>
            : <span className="flex items-center gap-1 text-gray-600 text-xs font-bold bg-gray-100 px-2 py-1 rounded border border-gray-200"><FaTimes /> Inativo</span>;
    };

    // Definição das Colunas para o Componente Table Genérico
    const columns = [
        { 
            key: 'nome', 
            label: 'Nome', 
            sortable: true,
            render: (val, row) => (
                <div className="font-medium text-gray-900">{val}</div>
            )
        },
        { 
            key: 'email', 
            label: 'Email', 
            sortable: true 
        },
        { 
            key: 'role', 
            label: 'Nível', 
            sortable: true,
            render: (val) => getRoleBadge(val)
        },
        { 
            key: 'status', 
            label: 'Status', 
            sortable: true,
            render: (val) => getStatusBadge(val)
        },
        {
            key: 'createdAt',
            label: 'Criado em',
            sortable: true,
            render: (val) => new Date(val).toLocaleDateString('pt-BR')
        },
        {
            key: 'acoes',
            label: 'Ações',
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    {/* Editar Nível */}
                    <button 
                        onClick={() => !isAdmin ? showToast('Apenas admins', 'error') : setEditModal({ isOpen: true, user: row, newRole: row.role })}
                        className={`p-2 rounded-lg transition-colors ${isAdmin ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-300 cursor-not-allowed'}`}
                        title="Editar Nível"
                    >
                        <FaEdit />
                    </button>

                    {/* Resetar Senha */}
                    <button 
                        onClick={() => handleResetPassword(row)}
                        className={`p-2 rounded-lg transition-colors ${isAdmin ? 'text-amber-600 hover:bg-amber-50' : 'text-gray-300 cursor-not-allowed'}`}
                        title="Resetar Senha"
                    >
                        <FaLock />
                    </button>

                    {/* Ativar/Desativar */}
                    <button 
                        onClick={() => handleToggleStatus(row)}
                        className={`p-2 rounded-lg transition-colors ${isAdmin ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                        title={row.status === 'ativo' ? 'Desativar' : 'Ativar'}
                    >
                        <FaPowerOff />
                    </button>

                    {/* Excluir */}
                    <button 
                        onClick={() => !isAdmin ? showToast('Apenas admins', 'error') : setDeleteModal({ isOpen: true, user: row })}
                        className={`p-2 rounded-lg transition-colors ${isAdmin ? 'text-red-600 hover:bg-red-50' : 'text-gray-300 cursor-not-allowed'}`}
                        title="Excluir"
                    >
                        <FaTrash />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="animate-fade-in px-2 md:px-0 pb-12">
            
            {/* --- CABEÇALHO --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-gray-200">
                <div>
                    <h2 className="text-3xl font-serif text-gray-900 font-normal">Gerenciamento de Usuários</h2>
                    <p className="text-gray-500 mt-1 text-sm md:text-base">Controle de acessos e permissões do sistema.</p>
                </div>
                {isAdmin && (
                    <button 
                        onClick={() => navigate('/cadastro-usuario')}
                        className="bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold shadow hover:bg-amber-700 transition-all flex items-center gap-2 text-sm uppercase tracking-wide"
                    >
                        <FaUserShield /> Novo Usuário
                    </button>
                )}
            </div>

            {/* --- BARRA DE FILTROS --- */}
            <Card className="mb-6 p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    
                    {/* Busca */}
                    <div className="md:col-span-5">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Buscar</label>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Nome ou email..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-sm bg-gray-50 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Filtro Nível */}
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Nível</label>
                        <select 
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm appearance-none cursor-pointer"
                        >
                            <option value="all">Todos</option>
                            <option value="admin">Admin</option>
                            <option value="lider">Líder</option>
                            <option value="secretaria">Secretaria</option>
                        </select>
                    </div>

                    {/* Filtro Status */}
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Status</label>
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm appearance-none cursor-pointer"
                        >
                            <option value="all">Todos</option>
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>

                    {/* Ordenação (Visual apenas para Desktop, lógica aplicada via clique) */}
                    <div className="md:col-span-3 hidden md:flex justify-end gap-2">
                        <button 
                            onClick={() => handleSort('nome')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 border rounded-xl text-sm font-bold transition-all ${sortConfig.key === 'nome' ? 'border-amber-600 bg-amber-50 text-amber-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            <FaSort /> Nome
                        </button>
                        <button 
                            onClick={() => handleSort('email')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 border rounded-xl text-sm font-bold transition-all ${sortConfig.key === 'email' ? 'border-amber-600 bg-amber-50 text-amber-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            <FaSort /> Email
                        </button>
                    </div>
                </div>
            </Card>

            {/* --- LISTAGEM (TABELA) --- */}
            <Table 
                data={processedUsers} 
                columns={columns} 
                loading={loading} 
                emptyMessage="Nenhum usuário encontrado com os filtros atuais."
            />

            {/* --- TOAST NOTIFICATION --- */}
            {toast.visible && (
                <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 flex items-center gap-3 border-l-4 ${toast.type === 'error' ? 'bg-white text-red-600 border-red-500' : 'bg-white text-green-600 border-green-500'}`}>
                    {toast.type === 'error' ? <FaTimes /> : <FaCheck />}
                    <span className="font-bold text-sm">{toast.message}</span>
                </div>
            )}

            {/* --- MODAL DE CONFIRMAÇÃO DE EXCLUSÃO --- */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <Card className="w-full max-w-md p-6 relative">
                        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Excluir Usuário?</h3>
                        <p className="text-gray-600 mb-6">
                            Tem certeza que deseja remover <strong>{deleteModal.user?.nome}</strong>? Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={() => setDeleteModal({ isOpen: false, user: null })}
                                className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg transition-all text-sm"
                            >
                                Sim, Excluir
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            {/* --- MODAL DE EDIÇÃO DE NÍVEL --- */}
            {editModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <Card className="w-full max-w-md p-6 relative">
                        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Alterar Nível de Acesso</h3>
                        <p className="text-gray-500 text-sm mb-6">Usuário: <strong>{editModal.user?.nome}</strong></p>
                        
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Novo Nível</label>
                            <select 
                                value={editModal.newRole}
                                onChange={(e) => setEditModal(prev => ({ ...prev, newRole: e.target.value }))}
                                className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                            >
                                <option value="admin">Admin (Acesso Total)</option>
                                <option value="lider">Líder (Acesso Parcial)</option>
                                <option value="secretaria">Secretaria (Acesso Parcial)</option>
                            </select>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={() => setEditModal({ isOpen: false, user: null, newRole: '' })}
                                className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={saveRoleEdit}
                                className="px-5 py-2.5 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-lg transition-all text-sm"
                            >
                                Salvar Alteração
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default UserManagement;