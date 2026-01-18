import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import TrainerClientDetail from './TrainerClientDetail.jsx';

const TrainerClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClientId, setSelectedClientId] = useState(null);

    const getToken = () => JSON.parse(localStorage.getItem('titanUser'))?.token;

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await fetch('https://titan-strength.me/api/v1/trainers/clients', {
                    headers: { Authorization: `Bearer ${getToken()}` }
                });
                const result = await res.json();
                if (result.success) setClients(result.data);
            } catch (err) {
                toast.error("Failed to load clients");
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    if (selectedClientId) {
        return <TrainerClientDetail clientId={selectedClientId} onBack={() => setSelectedClientId(null)} />;
    }

    return (
        <section className="dashboard-section">
            <div className="section-header-flex">
                <h2>Assigned Clients</h2>
            </div>

            <div className="table-container">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Goal</th>
                            <th>Branch</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td></tr>
                        ) : clients.length > 0 ? (
                            clients.map(c => (
                                <tr key={c.assignmentId}>
                                    <td>
                                        <strong>{c.member?.name}</strong><br />
                                        <small style={{ color: '#888' }}>{c.member?.email}</small>
                                    </td>
                                    <td>{c.member?.goal || 'N/A'}</td>
                                    <td>{c.member?.homeBranch || 'Main'}</td>
                                    <td><span className={`status-badge ${c.active ? 'active' : 'inactive'}`}>{c.active ? 'Active' : 'Inactive'}</span></td>
                                    <td>
                                        <button className="btn-primary" onClick={() => setSelectedClientId(c.member._id)}>
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No clients assigned</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default TrainerClients;