
function ItemDetails({ item, isOpen, onClick }) {
    return (
        <div className={`item-card ${isOpen ? 'open' : ''}`}>
            <div className="item-summary" onClick={onClick}>
                {/* Affiche un résumé de l'élément. Adaptez ceci à ce que vous voulez montrer. */}
                <h3>Fichier ID: {item.id} - Subsystem: {item.subsystem_id}</h3>
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
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ItemDetails;
