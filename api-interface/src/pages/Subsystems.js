import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSatName, getSubsystems } from '../api/apiService.js';

// /satellites/:satID/sub
const Subsystems = () => {
    // Récupère le paramètre :satId de l'URL
    const { satId } = useParams(); 
    const [subs, setSubs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    const satName = getSatName(satId);

    useEffect(() => {
        const fetchSatellite = async () => {
            try {
                // {data: {status: "success", data: [ {"subsystem_id": 1}, ...]}}
                const resp = await getSubsystems(satId);
                console.log(resp.data.data);
                setSubs(resp.data.data)
                setLoading(false);
            } catch (err) {
                setError('Erreur de communication avec le serveur.');
                console.error(err);
                setLoading(false);
            }
        };
        fetchSatellite();
    }, []);

    
    if (loading) return <div className="status">Chargement des subsystems...</div>;
    if (error) return <div className="error">{error}</div>;
    
    // TODO: Remove redundancy from the subs


    return(
        <div className="subsystems-page-container">
            <h2>Sélectionnez un subsystèmes du satellite {satName}:</h2>
            <div className="subsystems-list">
                {subs && subs.map(sub => (
                    <div className="subsystem-card" key={sub.subsystem_id}>
                        <Link to={`/satellites/${satId}/sub/${sub.subsystem_id}/files`} key={sub.subsystem_id} className="subsystem-card-link">
                            ID du subsystème : {sub.subsystem_id}
                        </Link>
                    </div>
                ))}
            </div>
            <Link to={`/satellites/`} className="back-link"> ◄ Revenir aux Satellite</Link>
        </div>
    );
};

export default Subsystems;