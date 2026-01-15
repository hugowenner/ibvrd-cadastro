import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // Vamos usar o api.js se existir, ou criar um fetch simples aqui

// Como não tenho o arquivo api.js no contexto anterior, vou usar fetch direto
import auth from '../services/auth';

const OraçãoContext = createContext();

export const useOração = () => useContext(OraçãoContext);

export const OraçãoProvider = ({ children }) => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

    const fetchPedidos = async () => {
        setLoading(true);
        try {
            const token = auth.getToken();
            const response = await fetch(`${API_URL}/pedidos_oracao.php`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const resJson = await response.json();
            if (!resJson.success) throw new Error(resJson.error);
            setPedidos(resJson.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addPedido = async (pedidoData) => {
        try {
            const token = auth.getToken();
            const response = await fetch(`${API_URL}/pedidos_oracao.php`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(pedidoData)
            });
            const resJson = await response.json();
            if (!resJson.success) throw new Error(resJson.error);
            await fetchPedidos(); // Recarrega a lista
            return true;
        } catch (err) {
            throw new Error(err.message);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const token = auth.getToken();
            const response = await fetch(`${API_URL}/pedidos_oracao.php`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id, status })
            });
            const resJson = await response.json();
            if (!resJson.success) throw new Error(resJson.error);
            await fetchPedidos();
        } catch (err) {
            throw new Error(err.message);
        }
    };

    const deletePedido = async (id) => {
        if (!window.confirm('Tem certeza que deseja remover este pedido?')) return;
        try {
            const token = auth.getToken();
            const response = await fetch(`${API_URL}/pedidos_oracao.php?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const resJson = await response.json();
            if (!resJson.success) throw new Error(resJson.error);
            await fetchPedidos();
        } catch (err) {
            throw new Error(err.message);
        }
    };

    useEffect(() => {
        fetchPedidos();
    }, []);

    return (
        <OraçãoContext.Provider value={{ pedidos, loading, error, addPedido, updateStatus, deletePedido, fetchPedidos }}>
            {children}
        </OraçãoContext.Provider>
    );
};