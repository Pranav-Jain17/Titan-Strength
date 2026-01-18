import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const TrainerOverview = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = JSON.parse(localStorage.getItem('titanUser'))?.token;
            try {
                const res = await fetch('https://titan-strength.me/api/v1/trainers/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const result = await res.json();
                if (result.success) setData(result.data);
            } catch (err) {
                toast.error("Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading-container">Loading Overview...</div>;

    return (
        <section className="dashboard-section">
            <div className="section-header-flex">
                <h2>Trainer Overview</h2>
            </div>

            <div className="cards-grid">
                <div className="dashboard-card stat-card">
                    <h3>Active Clients</h3>
                    <div className="stat-number">{data?.activeClients || 0}</div>
                    <div className="stat-label">Currently Assigned</div>
                </div>
                <div className="dashboard-card stat-card">
                    <h3>Pending Reviews</h3>
                    <div className="stat-number" style={{ color: data?.pendingReviews > 0 ? '#e74c3c' : '#2ecc71' }}>
                        {data?.pendingReviews || 0}
                    </div>
                    <div className="stat-label">Clients needing attention</div>
                </div>
            </div>

            <div className="dashboard-card">
                <h3>Today's Classes</h3>
                <div className="table-container">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Time</th>
                                <th>Capacity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.upcomingClasses?.length > 0 ? (
                                data.upcomingClasses.map((cls, idx) => (
                                    <tr key={idx}>
                                        <td>{cls.title}</td>
                                        <td>
                                            {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {' - '}
                                            {new Date(cls.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td>{cls.capacity} Max</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>No classes today</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default TrainerOverview;