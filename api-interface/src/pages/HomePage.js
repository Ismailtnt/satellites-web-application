import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSatellites } from '../api/apiService.js';

const HomePage = () => {
    /**
     * Afficher tous les satellites
     */
    const [satellites, setSatellites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSatellites = async () => {
            try {
                // response = {... ,data: {status: "success", data: {satellites: [...]}}}
                const response = await getSatellites();
                setSatellites(response.data.data.satellites);
                setLoading(false);
            } catch (err) {
                setError('Erreur de communication avec le serveur.');
                setLoading(false);
            }
        };
        fetchSatellites();
    }, []);
    
    if (loading) return <div className="status-message">Chargement des satellites...</div>;
    if (error) return <div className="status-message error">{error}</div>;

    // Retourner une liste des satellites qui dirigent vers leurs subsystèmes.
    return (
        <div className="satellite-page-container">
            <h1>Satellites</h1>
            <div className="satellite-list">
                {satellites.map(sat => (                    
                        <div key={sat.id} className="satellite-card">
                            <h2>{sat.name}</h2>
                            <Link to={`/satellites/${sat.id}/sub`} className="back-link" key={sat.id}>Voir Subsystems</Link>
                        </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;