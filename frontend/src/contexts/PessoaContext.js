import React, { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { api } from '../services/api';

export const PessoaContext = createContext();

export const PessoaProvider = ({ children }) => {
    const [pessoas, setPessoas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Função para buscar pessoas da API
    const fetchPessoas = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.getPessoas();
            setPessoas(response.data);
        } catch (err) {
            console.error("Falha ao buscar pessoas:", err);
            setError("Não foi possível carregar a lista de pessoas. Tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Carrega os dados na montagem do componente
    useEffect(() => {
        fetchPessoas();
    }, [fetchPessoas]);

    // Adiciona uma nova pessoa com atualização otimista
    const addPessoa = async (pessoaData) => {
        // Cria um ID temporário para a atualização otimista
        const tempId = `temp-${Date.now()}`;
        const optimisticPessoa = { ...pessoaData, id: tempId };
        
        try {
            // Atualização otimista: adiciona a pessoa à lista antes da resposta da API
            setPessoas(prevPessoas => [...prevPessoas, optimisticPessoa]);
            
            const response = await api.addPessoa(pessoaData);
            
            // Substitui a pessoa temporária pela resposta real da API
            setPessoas(prevPessoas => 
                prevPessoas.map(pessoa => 
                    pessoa.id === tempId ? response.data : pessoa
                )
            );
            
            return response.data;
        } catch (err) {
            console.error("Falha ao adicionar pessoa:", err);
            
            // Reverte a atualização otimista em caso de erro
            setPessoas(prevPessoas => 
                prevPessoas.filter(pessoa => pessoa.id !== tempId)
            );
            
            throw new Error("Não foi possível cadastrar a pessoa. Tente novamente.");
        }
    };

    // Atualiza uma pessoa existente
    const updatePessoa = async (id, pessoaData) => {
        try {
            const response = await api.updatePessoa(id, pessoaData);
            
            setPessoas(prevPessoas => 
                prevPessoas.map(pessoa => 
                    pessoa.id === id ? response.data : pessoa
                )
            );
            
            return response.data;
        } catch (err) {
            console.error("Falha ao atualizar pessoa:", err);
            throw new Error("Não foi possível atualizar os dados da pessoa. Tente novamente.");
        }
    };

    // Exclui uma pessoa com atualização otimista
    const deletePessoa = async (id) => {
        // Armazena a pessoa original caso precise reverter
        const originalPessoa = pessoas.find(pessoa => pessoa.id === id);
        
        try {
            // Atualização otimista: remove a pessoa antes da resposta da API
            setPessoas(prevPessoas => prevPessoas.filter(pessoa => pessoa.id !== id));
            
            await api.deletePessoa(id);
        } catch (err) {
            console.error("Falha ao excluir pessoa:", err);
            
            // Reverte a atualização otimista em caso de erro
            if (originalPessoa) {
                setPessoas(prevPessoas => [...prevPessoas, originalPessoa]);
            }
            
            throw new Error("Não foi possível excluir a pessoa. Tente novamente.");
        }
    };

    return (
        <PessoaContext.Provider value={{ 
            pessoas, 
            loading, 
            error, 
            fetchPessoas,
            addPessoa, 
            updatePessoa, 
            deletePessoa 
        }}>
            {children}
        </PessoaContext.Provider>
    );
};

PessoaProvider.propTypes = {
    children: PropTypes.node.isRequired
};