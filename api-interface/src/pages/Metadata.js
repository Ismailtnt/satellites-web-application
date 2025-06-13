import {useState, useEffect} from 'react';
import {getFileMetaData} from '../api/apiService.js';
import {Link } from 'react-router-dom';
import ItemDetails from '../ItemDetails.js';

function Metadata ({satId, subId, fileId, vers}) {
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const resp = await getFileMetaData(satId, subId, fileId, vers);
                console.log(resp);
                setMeta(resp.data.data);
                setLoading(false);
            } catch (err){
                setError('Erreur dans le serveur');
                console.error(error);
                setLoading(false);
            }
        };
        fetchMetadata();

    },[]);
    
    if (loading) return <div className="status">Chargement des subsystems...</div>;
    if (error) return <div className="error">{error}</div>;

    return(
        <div className="metadata">
            {meta && (
                Object.entries(meta).map(([key, value]) => (
                        <p key={key}>
                            <strong>{key.replace(/_/g, ' ')}:</strong> {/* Remplace les underscores pour une meilleure lisibilité */}
                            <span>{String(value)}</span> {/* Convertir la valeur en chaîne pour l'affichage */}
                        </p>
                ))
                /*<ItemDetails
                    item={meta}
                    link={false}
                    download={true}
                />*/
            )}
        </div>
    );

}

export default Metadata;