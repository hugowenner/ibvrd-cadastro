// frontend/src/services/auth.js

// MUDANÇA AQUI: Usa a variável de ambiente
const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
    console.error('REACT_APP_API_URL não definida no auth.js');
}

const login = async (email, password) => {
   console.log('Enviando login:', { email, password });
  const response = await fetch(`${API_URL}/auth.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
    console.log('Resposta do backend:', data);
  if (!response.ok || !data.success) throw new Error(data.error || 'Erro ao fazer login');
  localStorage.setItem('user', JSON.stringify(data.user));
  localStorage.setItem('token', data.token);
  return data;
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};

const getToken = () => {
  return localStorage.getItem('token');
};

const createUser = async (nome, email, password) => {
  const token = getToken();
  if (!token) throw new Error('Você não está autenticado.');

  const response = await fetch(`${API_URL}/users.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ nome, email, password }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Erro ao criar usuário');
  }

  return data;
};

const getUsers = async () => {
    const token = getToken();
    if (!token) throw new Error('Você não está autenticado.');

    const response = await fetch(`${API_URL}/users.php`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) throw new Error('Erro ao buscar usuários');
    return response.json();
};

export default {
  login,
  logout,
  getCurrentUser,
  getToken,
  createUser,
  getUsers,
};