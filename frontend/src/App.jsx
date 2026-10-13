import { Routes, Route, NavLink } from 'react-router-dom';
import SummaryPage from './pages/SummaryPage';
import SitesPage from './pages/SitesPage';
import InstallationsPage from './pages/InstallationsPage';

export default function App() {
    return (
        <div className="app">
            <header>
                <h1>Site Operations Dashboard</h1>
                <nav>
                    <NavLink to="/">Summary</NavLink>
                    <NavLink to="/sites">Sites</NavLink>
                    <NavLink to="/installations">Installations</NavLink>
                </nav>
            </header>
            <main>
                <Routes>
                    <Route path="/" element={<SummaryPage />} />
                    <Route path="/sites" element={<SitesPage />} />
                    <Route path="/installations" element={<InstallationsPage />} />
                </Routes>
            </main>
        </div>
    );
}