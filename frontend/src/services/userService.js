import auth from './auth';

const API_URL = process.env.REACT_APP_API_URL;

const withAuth = () => {
  const token = auth.getToken();
  if (!token) throw new Error('Você não está autenticado.');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

const normalizeUser = (u) => ({
  ...u,
  // backend manda created_at; sua tabela usa createdAt
  createdAt: u.created_at ?? u.createdAt ?? null,
  // garante status/role
  status: u.status ?? 'ativo',
  role: u.role ?? 'lider',
});

const listUsers = async () => {
  const res = await fetch(`${API_URL}/users.php`, {
    method: 'GET',
    headers: withAuth(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || 'Erro ao listar usuários');
  return (data.data || []).map(normalizeUser);
};

// Só ADMIN apaga (backend já bloqueia também)
const deleteUser = async (id) => {
  const res = await fetch(`${API_URL}/users.php?id=${id}`, {
    method: 'DELETE',
    headers: withAuth(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || 'Erro ao excluir usuário');
  return data;
};

// Editar (role/status) — você já tem PUT no backend
const updateUser = async (id, payload) => {
  const res = await fetch(`${API_URL}/users.php?id=${id}`, {
    method: 'PUT',
    headers: withAuth(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || 'Erro ao atualizar usuário');
  return data;
};

// Se ainda não existe no backend, deixa “stub” pra não quebrar a tela
const toggleUserStatus = async (id, currentStatus) => {
  const next = currentStatus === 'ativo' ? 'inativo' : 'ativo';
  return updateUser(id, { status: next });
};

// Você não tem endpoint de reset ainda (não invento). Mantém stub.
const resetUserPassword = async () => {
  throw new Error('Reset de senha ainda não implementado no backend.');
};

export default {
  listUsers,
  deleteUser,
  updateUser,
  toggleUserStatus,
  resetUserPassword,
};