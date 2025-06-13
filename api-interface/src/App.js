import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import HomePage from './pages/HomePage.js';
import Subsystems from './pages/Subsystems.js';
import SatelliteSubFiles from './pages/SatelliteSubFiles.js';
import FileVersion from './pages/FileVersion.js';
import Download from './pages/Download.js';
import Metadata from './pages/Metadata.js';

export default function App() {

  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path='/satellites' element={<HomePage />}/>
        <Route path='/satellites/:satId/sub' element={<Subsystems />}/>
        <Route path='/satellites/:satId/sub/:subId/files' element={<SatelliteSubFiles />} />
        <Route path='/satellites/:satId/sub/:subId/files/:fileId' element={<FileVersion />} />
        <Route path='/satellites/:satId/subsystems/:subId/files/:fileId/download' element={<Download />} />
        <Route path='/satellites/:satId/subsystems/:subId/files/:fileId/version/:vers' element={<Metadata />} />
      </Routes>
    </div>
  );
}

