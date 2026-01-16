import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '../services/auth';

const VisitaContext = createContext();

export const useVisita = () => useContext(VisitaContext);

export const VisitaProvider = ({ children }) => {
    const [visitas, setVisitas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

    const fetchVisitas = async () => {
        setLoading(true);
        try {
            const token = auth.getToken();
            const response = await fetch(`${API_URL}/visitas_pastorais.php`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const resJson = await response.json();
            if (!resJson.success) throw new Error(resJson.error);
            setVisitas(resJson.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addVisita = async (visitaData) => {
        try {
            const token = auth.getToken();
            const response = await fetch(`${API_URL}/visitas_pastorais.php`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(visitaData)
            });
            const resJson = await response.json();
            if (!resJson.success) throw new Error(resJson.error);
            await fetchVisitas();
            return true;
        } catch (err) {
            throw new Error(err.message);
        }
    };

    const deleteVisita = async (id) => {
        if (!window.confirm('Tem certeza que deseja remover este registro de visita?')) return;
        try {
            const token = auth.getToken();
            const response = await fetch(`${API_URL}/visitas_pastorais.php?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const resJson = await response.json();
            if (!resJson.success) throw new Error(resJson.error);
            await fetchVisitas();
        } catch (err) {
            throw new Error(err.message);
        }
    };

    useEffect(() => {
        fetchVisitas();
    }, []);

    return (
        <VisitaContext.Provider value={{ visitas, loading, error, addVisita, deleteVisita, fetchVisitas }}>
            {children}
        </VisitaContext.Provider>
    );
};