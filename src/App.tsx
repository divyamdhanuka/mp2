import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ListView from './views/ListView/ListView';
import GalleryView from './views/GalleryView/GalleryView';
import DetailView from './views/DetailView/DetailView';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/list" replace />} />
        <Route path="/list" element={<ListView />} />
        <Route path="/gallery" element={<GalleryView />} />
        <Route path="/meal/:id" element={<DetailView />} />
        <Route path="*" element={<Navigate to="/list" replace />} />
      </Routes>
    </Layout>
  );
}
export default App;
