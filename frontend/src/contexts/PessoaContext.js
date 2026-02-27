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
        dataCadastro: pessoa.data_cadastro,
        historico: pessoa.historico || []
    });

    /* =========================
       NORMALIZAÇÃO FRONT → BACK
    ========================== */
        const serializePessoa = (pessoa) => ({
        nomeCompleto: pessoa.nomeCompleto,
        dataNascimento: pessoa.dataNascimento || null,
        telefone: pessoa.telefone || null,
        email: pessoa.email || null,
        endereco: pessoa.endereco || null,
        tipo: pessoa.tipo || 'Visitante',
        
        // CORREÇÃO LÓGICA: Prioriza o string 'ministerio' (do formulário atual)
        // sobre o array 'ministerios' (do carregamento inicial), para garantir
        // que a edição de ministério seja salva corretamente.
        ministerio: pessoa.ministerio 
            ? pessoa.ministerio 
            : (Array.isArray(pessoa.ministerios) ? pessoa.ministerios[0] || null : null),
            
        observacoes: pessoa.observacoes || null
    });

    const fetchPessoas = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.getPessoas();
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

    const updatePessoa = async (id, pessoaData) => {
        const currentPessoa = pessoas.find(p => p.id === id);

        const historico = currentPessoa
            ? [...(currentPessoa.historico || [])]
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
