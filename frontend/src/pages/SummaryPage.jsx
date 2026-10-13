import { useFetch } from '../hooks/useFetch';

export default function SummaryPage() {
    const { data, loading, error } = useFetch('/summary');

    if (loading) return <p>Loading summary…</p>;
    if (error) return <p className="error">{error}</p>;

    const cards = [
        { label: 'Total Sites',       value: data.total_sites },
        { label: 'Active Sites',      value: data.active_sites },
        { label: 'Installations',     value: data.total_installations },
        { label: 'Completed Units',   value: data.completed_units }
    ];

    return (
        <section>
            <div className="summary-grid">
                {cards.map((c) => (
                    <div key={c.label} className="card">
                        <h3>{c.label}</h3>
                        <p>{c.value}</p>
                    </div>
                ))}
            </div>

            <h2>By Region</h2>
            <table>
                <thead><tr><th>Region</th><th>Sites</th><th>Installations</th></tr></thead>
                <tbody>
                    {data.by_region.map((r) => (
                        <tr key={r.region}>
                            <td>{r.region}</td><td>{r.sites}</td><td>{r.installations}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}