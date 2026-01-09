// frontend/src/services/auth.js

const API_URL = 'http://localhost:8000/backend/api'; // Ajuste conforme sua config

const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao fazer login');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Método de logout (apenas local)
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Verifica se há usuário salvo
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};

const getToken = () => {
  return localStorage.getItem('token');
};

export default {
  login,
  logout,
  getCurrentUser,
  getToken,
};