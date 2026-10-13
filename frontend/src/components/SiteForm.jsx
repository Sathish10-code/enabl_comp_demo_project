import { useState } from 'react';
import api from '../services/api';

const EMPTY = { name: '', code: '', region: '', status: 'active' };

export default function SiteForm({ onCreated }) {
    const [form, setForm] = useState(EMPTY);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const change = (field) => (e) =>
        setForm((f) => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await api.post('/sites', form);
            setForm(EMPTY);
            onCreated?.();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="site-form">
            {error && <p className="error">{error}</p>}
            <input required placeholder="Name" value={form.name} onChange={change('name')} />
            <input required placeholder="Code" value={form.code} onChange={change('code')} />
            <input required placeholder="Region" value={form.region} onChange={change('region')} />
            <select value={form.status} onChange={change('status')}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
            </select>
            <button disabled={submitting}>{submitting ? 'Saving…' : 'Create'}</button>
        </form>
    );
}