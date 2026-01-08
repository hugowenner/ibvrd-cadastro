// src/services/api.js

// Usa URL RELATIVA (mesmo domínio)
const API_URL = '/backend/api/pessoas.php';

export const api = {
    getPessoas: async () => {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Erro ao buscar pessoas');
        }
        return response.json();
    },

    addPessoa: async (pessoa) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
            headers: {
                'Content-Type': 'application/json'
            },
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
