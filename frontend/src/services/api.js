// src/services/api.js

// O "../../" faz voltar 2 níveis: de 'build/' até 'frontend/', e daí até raiz 'ibvrd-cadastro/'
// Depois entra em 'backend/api/pessoas.php'
const API_URL = 'http://localhost:8000/backend/api/pessoas.php';

export const api = {
    getPessoas: async () => {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar pessoas');
        return response.json();
    },

    addPessoa: async (pessoa) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pessoa)
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Erro ao cadastrar');
        }
        return response.json();
    },

    updatePessoa: async (id, pessoa) => {
        const response = await fetch(`${API_URL}?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pessoa)
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Erro ao atualizar');
        }
        return response.json();
    },

    deletePessoa: async (id) => {
        const response = await fetch(`${API_URL}?id=${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Erro ao excluir');
        }
        return response.json();
    }
};