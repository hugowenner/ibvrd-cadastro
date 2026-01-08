import React, {
    createContext,
    useState,
    useEffect,
    useCallback
} from 'react';
import PropTypes from 'prop-types';
import { api } from '../services/api';

export const PessoaContext = createContext();

export const PessoaProvider = ({ children }) => {
    const [pessoas, setPessoas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const MINISTERIOS_DISPONIVEIS = [
        'Louvor',
        'Música',
        'Infantil',
        'Adolescentes',
        'Jovens',
        'Missões',
        'Ação Social',
        'Intercessão',
        'Ushers',
        'Diaconia'
    ];

    /* =========================
       NORMALIZAÇÃO BACK → FRONT
    ========================== */
    const normalizePessoa = (pessoa) => ({
        id: pessoa.id,
        nomeCompleto: pessoa.nome_completo,
        dataNascimento: pessoa.data_nascimento,
        telefone: pessoa.telefone,
        email: pessoa.email,
        endereco: pessoa.endereco,
        tipo: pessoa.tipo,
        status: pessoa.status || 'Ativo',
        ministerios: pessoa.ministerio ? [pessoa.ministerio] : [],
        observacoes: pessoa.observacoes,
        historico: pessoa.historico || []
    });

    /* =========================
       NORMALIZAÇÃO FRONT → BACK
    ========================== */
    const serializePessoa = (pessoa) => ({
        nomeCompleto: pessoa.nomeCompleto,
        dataNascimento: pessoa.dataNascimento,
        telefone: pessoa.telefone,
        email: pessoa.email,
        endereco: pessoa.endereco,
        tipo: pessoa.tipo,
        ministerio: Array.isArray(pessoa.ministerios)
            ? pessoa.ministerios[0] || null
            : pessoa.ministerio || null,
        observacoes: pessoa.observacoes
    });

    /* =========================
       FETCH
    ========================== */
    const fetchPessoas = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.getPessoas(); // retorna array
            setPessoas(response.map(normalizePessoa));

        } catch (err) {
            console.error(err);
            setError('Erro ao carregar pessoas.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPessoas();
    }, [fetchPessoas]);

    /* =========================
       ADD
    ========================== */
    const addPessoa = async (pessoaData) => {
        const tempId = `temp-${Date.now()}`;
        const optimisticPessoa = {
            ...pessoaData,
            id: tempId,
            historico: []
        };

        try {
            setPessoas(prev => [...prev, optimisticPessoa]);

            const response = await api.addPessoa(
                serializePessoa(pessoaData)
            );

            const pessoaNormalizada = normalizePessoa(response);

            setPessoas(prev =>
                prev.map(p =>
                    p.id === tempId ? pessoaNormalizada : p
                )
            );

            return pessoaNormalizada;

        } catch (err) {
            console.error(err);
            setPessoas(prev => prev.filter(p => p.id !== tempId));
            throw new Error('Erro ao cadastrar pessoa.');
        }
    };

    /* =========================
       HISTÓRICO
    ========================== */
    const generateHistoryEntries = (oldData, newData) => {
        const entries = [];
        const campos = ['nomeCompleto', 'tipo', 'status', 'ministerios'];

        campos.forEach(campo => {
            const oldVal = oldData?.[campo];
            const newVal = newData?.[campo];

            if (Array.isArray(oldVal) && Array.isArray(newVal)) {
                if (oldVal.join() !== newVal.join()) {
                    entries.push({
                        data: new Date().toISOString(),
                        campo,
                        valorAnterior: oldVal.join(', '),
                        valorNovo: newVal.join(', ')
                    });
                }
            } else if (oldVal !== newVal) {
                entries.push({
                    data: new Date().toISOString(),
                    campo,
                    valorAnterior: oldVal,
                    valorNovo: newVal
                });
            }
        });

        return entries;
    };

    /* =========================
       UPDATE
    ========================== */
    const updatePessoa = async (id, pessoaData) => {
        const currentPessoa = pessoas.find(p => p.id === id);

        const historico = currentPessoa
            ? [
                ...(currentPessoa.historico || []),
                ...generateHistoryEntries(currentPessoa, pessoaData)
            ]
            : [];

        try {
            const response = await api.updatePessoa(
                id,
                serializePessoa(pessoaData)
            );

            const pessoaAtualizada = {
                ...normalizePessoa(response),
                historico
            };

            setPessoas(prev =>
                prev.map(p =>
                    p.id === id ? pessoaAtualizada : p
                )
            );

            return pessoaAtualizada;

        } catch (err) {
            console.error(err);
            throw new Error('Erro ao atualizar pessoa.');
        }
    };

    /* =========================
       DELETE
    ========================== */
    const deletePessoa = async (id) => {
        const backup = pessoas;

        try {
            setPessoas(prev => prev.filter(p => p.id !== id));
            await api.deletePessoa(id);
        } catch (err) {
            console.error(err);
            setPessoas(backup);
            throw new Error('Erro ao excluir pessoa.');
        }
    };

    return (
        <PessoaContext.Provider
            value={{
                pessoas,
                loading,
                error,
                fetchPessoas,
                addPessoa,
                updatePessoa,
                deletePessoa,
                MINISTERIOS_DISPONIVEIS
            }}
        >
            {children}
        </PessoaContext.Provider>
    );
};

PessoaProvider.propTypes = {
    children: PropTypes.node.isRequired
};
