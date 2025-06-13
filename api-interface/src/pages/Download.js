import {downloadFile} from '../api/apiService.js';

const Download = ({ satId, subId, fileId, fileVer }) => {
  const handleDownload = async () => {
    try {
      const response = await downloadFile(satId, subId, fileId, fileVer); 
      /*axios.get(
        `/satellites/${satId}/subsystems/${subId}/files/${fileId}/version/${fileVer}/download/`,
        {
          responseType: "blob", // Important for file download
        }
      );*/

      // Create a link and click it to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Optional: get filename from content-disposition
      const disposition = response.headers["content-disposition"];
      const filename = disposition
        ? disposition.split("filename=")[1].replace(/"/g, "")
        : `file_${fileId}_v${fileVer}`;

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Download File
    </button>
  );
};

export default Download;


/*const Download = () => {
    // 'file' doit contenir au moins { id: 'file123', name: 'my_data.csv' }
    // Vous pourriez ajouter d'autres propriétés comme 'type' ou 'format' si l'API les renvoie
    const [file, setFile] = useState(null);

    // Construire l'URL de téléchargement
    // Assurez-vous que votre API est accessible à la même origine ou que CORS est configuré.
    // Si votre backend est sur 'http://localhost:8080', vous pourriez avoir:
    const baseUrl = 'http://localhost:8080';
    // Ou si l'API est sur le même domaine, un chemin relatif suffit:
    const {satId, subId, fileId, vers} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const downloadUrl = baseUrl + `/api/satellites/${satId}/subsystems/${subId}/files/${file.id}/download?format=${file.format || 'txt'}`;
    console.log(downloadUrl);

    useEffect(() => {
        const fetchDownload = async () =>  {
            try {
                const f = await downloadFile(satId, subId, fileId, vers);
                console.log(f);
                setFile(f.data.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Erreur dans le serveur.');
                setLoading(false);
            }
        };
        fetchDownload();
    },[]);

    if (loading) return <div className="loading-message">Chargement des fichiers...</div>;
    if (error) return <div className="error-message">Erreur: {error}</div>;

    return (
        <div className="file-item-card">
            <h1>Fichiers pour Satellite {satId} - Sous-système {subId}</h1>
            <h3>{file['Content-Disposition']}</h3>
            <p>Type: {file.content_type || 'Inconnu'}</p>
            <a href={downloadUrl} download={file.name || `sat_${satId}_sub_${subId}_file_${file.id_in_subsystem}_v${file.file_ver}`} className="download-button">
                Télécharger
            </a>
        </div>
    );
};

*/