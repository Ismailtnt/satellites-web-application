import { Link } from 'react-router-dom';
import Download from './pages/Download';
import './ItemDetails.css';

function ItemDetails({ item, link, isOpen, onClick}) {
    return (
        <div className={`item-card ${isOpen ? 'open' : ''}`}>
            <div className="item-summary" onClick={onClick}>
                {/* Affiche un résumé de l'élément. Adaptez ceci à ce que vous voulez montrer. */}
                <h3>Fichier ID: {item.id_in_subsystem} - Subsystem: {item.subsystem_id}</h3>
                <span className="toggle-icon">{isOpen ? '▲' : '▼'}</span>
            </div>

            {/* Les détails complets ne sont affichés que si 'isOpen' est vrai */}
            {isOpen && (
                <div className="item-content">
                    {/* Itérer sur les clés et valeurs de l'objet pour les afficher */}
                    {Object.entries(item).map(([key, value]) => (
                        <p key={key}>
                            <strong>{key.replace(/_/g, ' ')}:</strong> {/* Remplace les underscores pour une meilleure lisibilité */}
                            <span>{String(value)}</span> {/* Convertir la valeur en chaîne pour l'affichage */}
                            {link && (key === "id_in_subsystem") && (<Link to={`/satellites/${item.satIdKey}/sub/${item.subsystem_id}/files/${item.id_in_subsystem}`}> <button>See file versions</button> </Link>)}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ItemDetails;
