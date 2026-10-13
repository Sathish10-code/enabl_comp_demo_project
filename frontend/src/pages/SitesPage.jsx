import { useState, useCallback } from 'react';
import { useFetch } from '../hooks/useFetch';
import SiteForm from '../components/SiteForm';

export default function SitesPage() {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [reloadKey, setReloadKey] = useState(0);

    const url = `/sites?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}&_=${reloadKey}`;
    const { data, loading, error } = useFetch(url);
    const sites = data?.data ?? [];

    const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

    return (
        <section>
            <h2>Create Site</h2>
            <SiteForm onCreated={refresh} />

            <h2>Sites</h2>
            <div className="filters">
                <input
                    placeholder="Search by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">All statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                </select>
            </div>

            {loading && <p>Loading…</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && (
                <table>
                    <thead>
                        <tr><th>Name</th><th>Code</th><th>Region</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        {sites.length === 0 && (
                            <tr><td colSpan={4}>No sites found</td></tr>
                        )}
                        {sites.map((s) => (
                            <tr key={s.id}>
                                <td>{s.name}</td>
                                <td>{s.code}</td>
                                <td>{s.region}</td>
                                <td>{s.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}