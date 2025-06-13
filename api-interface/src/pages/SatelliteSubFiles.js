import {useState, useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';
import {getSubsystemFiles} from '../api/apiService.js';
import ItemDetails from '../ItemDetails.js';

const SatelliteSubFiles = () => {
    const { satId, subId } = useParams();
    const [files, setFiles] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const [openItemId, setOpenItemId] = useState(null);

    
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const f = await getSubsystemFiles(satId, subId);
                setFiles(f.data.data);
                console.log(f.data.data);
                setLoading(false);
            }   catch (err) {
                setLoading(false);
                setError(err);
                console.error(err);
            }
        } 
        fetchFiles();
    }, []);
    
    if (loading) return <div className="status">Chargement des subsystems...</div>;
    if (error) return <div className="error">{error}</div>;
    if (files.lenght === 0) return <div className="no-files">Pas de fichier pour le subsystème {subId} du satellite {satId}</div>;
    
    const handleItemClick = (id) => {
        // Si l'élément cliqué est déjà ouvert, fermez-le.
        // Sinon, ouvrez l'élément cliqué.
        setOpenItemId(prevId => (prevId === id ? null : id));
    };

    return (
        <div className="files">
            <h1>Liste des Fichiers Satellites</h1>
            <div className="item-list">
                {files.map(item => {
                    item["satIdKey"]=satId;
                    return(
                        <>
                            <ItemDetails
                                    key={item.id}
                                    link={true}
                                    item={item}
                                    isOpen={item.id === openItemId} // Détermine si cet élément est ouvert
                                    onClick={() => handleItemClick(item.id)} // Gère le clic
                            />
                        </>
                    );
                })}
                <Link to={`/satellites/${satId}/sub`} className="back-link"> ◄ Revenir aux Subsystems</Link>
            </div>
        </div>
    );
}

export default SatelliteSubFiles;