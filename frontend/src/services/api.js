// src/services/api.js

/**
 * URL da API definida por ambiente
 * - localhost  → .env.development
 * - produção   → .env.production
 */
const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
    console.error('REACT_APP_API_URL não definida');
}

export const api = {
    async getPessoas() {
        // CORREÇÃO: Adicionado '/pessoas.php' ao final da URL
        const response = await fetch(`${API_URL}/pessoas.php`);

        if (!response.ok) {
            throw new Error('Erro ao buscar pessoas');
        }

        return response.json();
    },

    async addPessoa(pessoa) {
        // CORREÇÃO: Adicionado '/pessoas.php' ao final da URL
        const response = await fetch(`${API_URL}/pessoas.php`, {
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

    async updatePessoa(id, pessoa) {
        // CORREÇÃO: Adicionado '/pessoas.php' antes do parâmetro ?id=
        const response = await fetch(`${API_URL}/pessoas.php?id=${id}`, {
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

    async deletePessoa(id) {
        // CORREÇÃO: Adicionado '/pessoas.php' antes do parâmetro ?id=
        const response = await fetch(`${API_URL}/pessoas.php?id=${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Erro ao excluir');
        }

        return response.json();
    }
};