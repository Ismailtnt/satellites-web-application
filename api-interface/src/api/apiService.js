import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Port : 5432 
});

// GET /api/satellites/
export const getSatellites = () => apiClient.get('satellites/');

// GET /api/satellites/{sat_id}/subsystems
export const getSubsystems = (satId) => apiClient.get(`satellites/${satId}/subsystems`);

// GET /api/satellites/{sat_id}/subsystems/{sub_id}/files/
export const getSubsystemFiles = (satId, subId) => 
    apiClient.get(`satellites/${satId}/subsystems/${subId}/files/`);

// GET /api/satellites/{sat_id}/subsystems/{sub_id}/files/{file_id}/
export const getFileVersions = (satId, subId, fileId) => 
    apiClient.get(`satellites/${satId}/subsystems/${subId}/files/${fileId}/`);

// GET /api/satellites/{sat_id}/subsystems/{sub_id}/files/{file_id}/version/{file_ver}
export const getFileMetaData = (satId, subId, fileId, fileVer) => 
    apiClient.get(`satellites/${satId}/subsystems/${subId}/files/${fileId}/version/${fileVer}/`);

// GET /api/satellites/{sat_id}/subsystems/{sub_id}/files/{file_id}/version/{file_ver}/download/
export const downloadFile = (satId, subId, fileId, fileVer) => {
    return apiClient.get(
        `satellites/${satId}/subsystems/${subId}/files/${fileId}/version/${fileVer}/download/`, 
        {
            // Très important: indique à axios de traiter la réponse comme un flux de données brutes
            responseType: 'blob',
        }
    );
};

export const getSatName = (satId) => satId === 1? "UM5-EOSAT" : "MOHAMMEDIA-SAT";

// export const getSatelliteConfig = (satId) => apiClient.get(`satellites/${satId}/config/`);
// export const getSatelliteLogs = (satId) => apiClient.get(`satellites/${satId}/logs/`);