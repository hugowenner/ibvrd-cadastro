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

    // Função auxiliar para normalizar dados (migração de string para array e default status)
    const normalizePessoa = (pessoa) => {
        return {
            ...pessoa,
            // Garante que exista um status, padrão 'Ativo' se nulo
            status: pessoa.status || 'Ativo',
            // Migração: se 'ministerio' for string, vira array. Se for array, mantém.
            ministerios: Array.isArray(pessoa.ministerios) 
                ? pessoa.ministerios 
                : (pessoa.ministerio ? [pessoa.ministerio] : []),
            // Garante array de histórico
            historico: pessoa.historico || []
        };
    };

    // Função para buscar pessoas da API
    const fetchPessoas = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.getPessoas();
            // Normaliza os dados ao buscar para garantir compatibilidade
            const normalizedData = response.data.map(normalizePessoa);
            setPessoas(normalizedData);
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
        
        // Prepara os dados garantindo status padrão e array de ministérios
        const dataToSubmit = {
            ...pessoaData,
            status: pessoaData.status || 'Ativo',
            ministerios: Array.isArray(pessoaData.ministerios) ? pessoaData.ministerios : (pessoaData.ministerio ? [pessoaData.ministerio] : []),
            historico: []
        };

        const optimisticPessoa = { ...dataToSubmit, id: tempId };
        
        try {
            // Atualização otimista
            setPessoas(prevPessoas => [...prevPessoas, normalizePessoa(optimisticPessoa)]);
            
            const response = await api.addPessoa(dataToSubmit);
            
            // Substitui a pessoa temporária pela resposta real da API
            setPessoas(prevPessoas => 
                prevPessoas.map(pessoa => 
                    pessoa.id === tempId ? normalizePessoa(response.data) : pessoa
                )
            );
            
            return response.data;
        } catch (err) {
            console.error("Falha ao adicionar pessoa:", err);
            // Reverte
            setPessoas(prevPessoas => prevPessoas.filter(pessoa => pessoa.id !== tempId));
            throw new Error("Não foi possível cadastrar a pessoa. Tente novamente.");
        }
    };

    // Função para gerar entrada de histórico
    const generateHistoryEntries = (oldData, newData) => {
        const entries = [];
        const camposMonitorados = ['nomeCompleto', 'tipo', 'status', 'ministerios'];
        
        camposMonitorados.forEach(campo => {
            const valOld = oldData[campo];
            const valNew = newData[campo];

            // Comparação simples para strings e números
            if (typeof valOld !== 'object' && typeof valNew !== 'object') {
                if (valOld !== valNew) {
                    entries.push({
                        data: new Date().toISOString(),
                        campo: campo,
                        valorAnterior: valOld,
                        valorNovo: valNew
                    });
                }
            } 
            // Comparação para Arrays (ex: ministerios)
            else if (Array.isArray(valOld) && Array.isArray(valNew)) {
                // Converte para string ordenada para comparar se o conteúdo mudou
                const sortedOld = [...valOld].sort().join(', ');
                const sortedNew = [...valNew].sort().join(', ');
                
                if (sortedOld !== sortedNew) {
                    entries.push({
                        data: new Date().toISOString(),
                        campo: campo,
                        valorAnterior: valOld.join(', '),
                        valorNovo: valNew.join(', ')
                    });
                }
            }
        });
        return entries;
    };

    // Atualiza uma pessoa existente (com geração de histórico)
    const updatePessoa = async (id, pessoaData) => {
        // Encontra a pessoa atual no estado local para gerar histórico antes da requisição
        const currentPessoa = pessoas.find(p => p.id === id);
        
        // Gera histórico das alterações
        const novasEntradasHistorico = currentPessoa ? generateHistoryEntries(currentPessoa, pessoaData) : [];
        
        // Prepara payload mantendo histórico existente
        const payload = {
            ...pessoaData,
            historico: [...(currentPessoa?.historico || []), ...novasEntradasHistorico]
        };

        try {
            const response = await api.updatePessoa(id, payload);
            
            setPessoas(prevPessoas => 
                prevPessoas.map(pessoa => 
                    pessoa.id === id ? normalizePessoa(response.data) : pessoa
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
        const originalPessoa = pessoas.find(pessoa => pessoa.id === id);
        
        try {
            setPessoas(prevPessoas => prevPessoas.filter(pessoa => pessoa.id !== id));
            await api.deletePessoa(id);
        } catch (err) {
            console.error("Falha ao excluir pessoa:", err);
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
            deletePessoa,
            MINISTERIOS_DISPONIVEIS // Expondo para o Form usar
        }}>
            {children}
        </PessoaContext.Provider>
    );
};

PessoaProvider.propTypes = {
    children: PropTypes.node.isRequired
};