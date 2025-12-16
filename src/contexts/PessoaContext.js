import React, { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const PessoaContext = createContext();

export const PessoaProvider = ({ children }) => {
    const [pessoas, setPessoas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPessoas = async () => {
            try {
                const response = await api.getPessoas();
                setPessoas(response.data);
            } catch (error) {
                console.error("Falha ao buscar pessoas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPessoas();
    }, []);

    const addPessoa = async (pessoaData) => {
        try {
            const response = await api.addPessoa(pessoaData);
            setPessoas(prevPessoas => [...prevPessoas, response.data]);
            return response.data;
        } catch (error) {
            console.error("Falha ao adicionar pessoa:", error);
            throw error;
        }
    };

    return (
        <PessoaContext.Provider value={{ pessoas, loading, addPessoa }}>
            {children}
        </PessoaContext.Provider>
    );
};