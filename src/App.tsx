import { HashRouter, Routes, Route } from 'react-router-dom';
import { AdminPage } from './pages/admin';
import MainPage from './MainPage';
import ReklamacniRad from './pages/ReklamacniRad';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="reklamacni-rad" element={<ReklamacniRad />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

