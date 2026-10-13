// src/components/SummaryCards.jsx
import { useFetch } from '../hooks/useFetch';
export default function SummaryCards() {
    const { data, loading, error } = useFetch('/summary');

    if (loading) return <div>Loading…</div>;
    if (error) return <div className="error">Failed to load summary</div>;

    const cards = [
        { label: 'Total Sites', value: data.total_sites },
        { label: 'Active Sites', value: data.active_sites },
        { label: 'Installations', value: data.total_installations },
        { label: 'Completed Units', value: data.completed_units }
    ];

    return (
        <div className="summary-grid">
            {cards.map(c => (
                <div key={c.label} className="card">
                    <h3>{c.label}</h3>
                    <p>{c.value}</p>
                </div>
            ))}
        </div>
    );
}