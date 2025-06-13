import {useState, useEffect} from 'react';
import {getFileVersions} from '../api/apiService.js';
import { useParams, Link } from 'react-router-dom';
import ItemDetails from '../ItemDetails.js';
import Metadata from './Metadata.js';
import Download from './Download.js';

function FileVersion () {
    const data = {   "id": 1,
                "file_ver": 1,
                "init_ts": "2024-09-20T00:09:20.741965Z",
                "update_ts": "2024-09-25T10:47:47.666605Z",
                "type_id": 2,
                "capacity": 78,
                "last_entry": 78,
                "sig": 86649570,
                "upload_hash": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
                "removed": false,
                "sat_file_id": 13};

    const { satId, subId, fileId } = useParams();
    const [fileVersion, setFileVersion] = useState(data);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const [openItemId, setOpenItemId] = useState(null);

    
    useEffect(() => {
        const fetchFileVersion = async () => {
            try {
                /* data : 
                {   "id": 1,
                "file_ver": 1,
                "init_ts": "2024-09-20T00:09:20.741965Z",
                "update_ts": "2024-09-25T10:47:47.666605Z",
                "type_id": 2,
                "capacity": 78,
                "last_entry": 78,
                "sig": 86649570,
                "upload_hash": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
                "removed": false,
                "sat_file_id": 13}*/
                const resp = await getFileVersions(satId, subId, fileId);
                console.log(resp);
                setFileVersion(resp.data.data);
                setLoading(false);
            } catch (err){
                console.error(error);
                // Afficher l'erreur dans la console et mettre à jour l'état d'erreur
                setError(err.message || 'Une erreur est survenue lors de la récupération des versions de fichier.');
                setLoading(false);
            }
        };
        fetchFileVersion();
        
    },[]);
    
    const baseUrl = 'http://localhost:8080';
    const downloadUrl = baseUrl + `/api/satellites/${satId}/subsystems/${subId}/files/${fileId}/download?format=${fileVersion.format || 'txt'}`;

    if (loading) return <div className="status">Chargement des subsystems...</div>;
    if (error) return <div className="error">{error}</div>;

    const handleItemClick = (id) => {
        // Si l'élément cliqué est déjà ouvert, fermez-le.
        // Sinon, ouvrez l'élément cliqué.
        setOpenItemId(prevId => (prevId === id ? null : id));
    };


    return (
        <div className="files">
            <h1>Liste des versions des fichiers Satellites</h1>
            <div className="item-list">
                {fileVersion.map(item => (
                    <>
                        <ItemDetails
                            key={item.id}
                            item={item}
                            link={false}
                            download={true}
                            isOpen={item.id === openItemId} // Détermine si cet élément est ouvert
                            onClick={() => handleItemClick(item.id)} // Gère le clic
                        />
                        {/*<Link to={`/satellites/${satId}/subsystems/${subId}/files/${fileId}/download`}></Link><button>Télécharger le fichier</button>*/}
                        <Download satId={satId} subId={subId} fileId={fileId} fileVer={item.file_ver} />
                        {/*<a href={downloadUrl} download={fileVersion.name || `sat_${satId}_sub_${subId}_file_${fileId}_v${fileVersion.file_ver}`} className="download-button">
                            Télécharger
                        </a>*/}
                    </>)
                )}
            </div>
            <Link to={`/satellites/${satId}/sub/${subId}/files`} className="back-link"> ◄ Revenir aux Fichiers Satellite</Link>
        </div>
    );

}

export default FileVersion;