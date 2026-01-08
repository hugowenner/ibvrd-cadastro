// src/contexts/PessoaContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { api } from '../services/api';

export const PessoaContext = createContext();

export const PessoaProvider = ({ children }) => {
    const [pessoas, setPessoas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lista de ministérios disponíveis para seleção
    const MINISTERIOS_DISPONIVEIS = [
        'Louvor', 'Música', 'Infantil', 'Adolescentes', 
        'Jovens', 'Missões', 'Ação Social', 'Intercessão', 'Ushers', 'Diaconia'
    ];

    // Função auxiliar para normalizar dados
    const normalizePessoa = (pessoa) => {
        return {
            ...pessoa,
            status: pessoa.status || 'Ativo',
            ministerios: Array.isArray(pessoa.ministerios) 
                ? pessoa.ministerios 
                : (pessoa.ministerio ? [pessoa.ministerio] : []),
            historico: pessoa.historico || []
        };
    };

    const fetchPessoas = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.getPessoas();
            const normalizedData = response.data.map(normalizePessoa);
            setPessoas(normalizedData);
        } catch (err) {
            console.error("Falha ao buscar pessoas:", err);
            setError("Não foi possível carregar a lista de pessoas. Tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPessoas();
    }, [fetchPessoas]);

    const addPessoa = async (pessoaData) => {
        const tempId = `temp-${Date.now()}`;
        const dataToSubmit = {
            ...pessoaData,
            status: pessoaData.status || 'Ativo',
            ministerios: Array.isArray(pessoaData.ministerios) ? pessoaData.ministerios : (pessoaData.ministerio ? [pessoaData.ministerio] : []),
            historico: []
        };
        const optimisticPessoa = { ...dataToSubmit, id: tempId };
        
        try {
            setPessoas(prevPessoas => [...prevPessoas, normalizePessoa(optimisticPessoa)]);
            const response = await api.addPessoa(dataToSubmit);
            setPessoas(prevPessoas => 
                prevPessoas.map(pessoa => 
                    pessoa.id === tempId ? normalizePessoa(response.data) : pessoa
                )
            );
            return response.data;
        } catch (err) {
            console.error("Falha ao adicionar pessoa:", err);
            setPessoas(prevPessoas => prevPessoas.filter(pessoa => pessoa.id !== tempId));
            throw new Error("Não foi possível cadastrar a pessoa. Tente novamente.");
        }
    };

    const generateHistoryEntries = (oldData, newData) => {
        const entries = [];
        const camposMonitorados = ['nomeCompleto', 'tipo', 'status', 'ministerios'];
        camposMonitorados.forEach(campo => {
            const valOld = oldData[campo];
            const valNew = newData[campo];
            if (typeof valOld !== 'object' && typeof valNew !== 'object') {
                if (valOld !== valNew) entries.push({ data: new Date().toISOString(), campo, valorAnterior: valOld, valorNovo: valNew });
            } else if (Array.isArray(valOld) && Array.isArray(valNew)) {
                if ([...valOld].sort().join(', ') !== [...valNew].sort().join(', ')) {
                    entries.push({ data: new Date().toISOString(), campo, valorAnterior: valOld.join(', '), valorNovo: valNew.join(', ') });
                }
            }
        });
        return entries;
    };

    const updatePessoa = async (id, pessoaData) => {
        const currentPessoa = pessoas.find(p => p.id === id);
        const novasEntradasHistorico = currentPessoa ? generateHistoryEntries(currentPessoa, pessoaData) : [];
        const payload = { ...pessoaData, historico: [...(currentPessoa?.historico || []), ...novasEntradasHistorico] };
        try {
            const response = await api.updatePessoa(id, payload);
            setPessoas(prevPessoas => prevPessoas.map(pessoa => pessoa.id === id ? normalizePessoa(response.data) : pessoa));
            return response.data;
        } catch (err) {
            console.error("Falha ao atualizar pessoa:", err);
            throw new Error("Não foi possível atualizar os dados da pessoa. Tente novamente.");
        }
    };

    const deletePessoa = async (id) => {
        const originalPessoa = pessoas.find(pessoa => pessoa.id === id);
        try {
            setPessoas(prevPessoas => prevPessoas.filter(pessoa => pessoa.id !== id));
            await api.deletePessoa(id);
        } catch (err) {
            console.error("Falha ao excluir pessoa:", err);
            if (originalPessoa) setPessoas(prevPessoas => [...prevPessoas, originalPessoa]);
            throw new Error("Não foi possível excluir a pessoa. Tente novamente.");
        }
    };

    return (
        <PessoaContext.Provider value={{ 
            pessoas, loading, error, fetchPessoas,
            addPessoa, updatePessoa, deletePessoa,
            MINISTERIOS_DISPONIVEIS 
        }}>
            {children}
        </PessoaContext.Provider>
    );
};

PessoaProvider.propTypes = { children: PropTypes.node.isRequired };