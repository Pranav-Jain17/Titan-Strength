import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MemberMyPlan = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = JSON.parse(localStorage.getItem('titanUser'))?.token;

    useEffect(() => {
        const fetchMySubs = async () => {
            try {
                setLoading(true);
                const res = await fetch('https://titan-strength.me/api/v1/subscriptions/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) setSubscriptions(data.data);
            } catch (error) {
                toast.error("Failed to load your plan");
            } finally {
                setLoading(false);
            }
        };
        fetchMySubs();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const activePlan = subscriptions.find(sub => sub.status === 'active');

    return (
        <div className="fade-in">
            <h2 style={{ marginBottom: '25px', color: '#fff' }}>My Membership</h2>

            {loading ? <p>Loading plan details...</p> : (
                <>
                    {activePlan ? (
                        <div className="dashboard-card" style={{ marginBottom: '40px', maxWidth: '600px', borderColor: 'var(--primary)' }}>
                            <div className="card-header">
                                <h3 style={{ fontSize: '1.5rem' }}>Current Active Plan</h3>
                                <span className="status-badge active">Active</span>
                            </div>
                            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div>
                                    <label style={{ color: '#888', fontSize: '0.85rem' }}>PLAN NAME</label>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{activePlan.plan?.name}</div>
                                </div>
                                <div>
                                    <label style={{ color: '#888', fontSize: '0.85rem' }}>VALID UNTIL</label>
                                    <div style={{ fontSize: '1.1rem', color: '#fff' }}>{formatDate(activePlan.endDate)}</div>
                                </div>
                                <div>
                                    <label style={{ color: '#888', fontSize: '0.85rem' }}>DURATION</label>
                                    <div>{activePlan.plan?.durationDays} Days</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="dashboard-card" style={{ marginBottom: '40px', padding: '40px', textAlign: 'center' }}>
                            <h3>No Active Membership</h3>
                            <p style={{ color: '#888' }}>Contact the gym manager to subscribe to a plan.</p>
                        </div>
                    )}

                    <h3 style={{ marginBottom: '20px', color: '#fff' }}>Subscription History</h3>
                    <div className="table-container">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Plan</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscriptions.length > 0 ? (
                                    subscriptions.map(sub => (
                                        <tr key={sub._id}>
                                            <td>{sub.plan?.name}</td>
                                            <td>{formatDate(sub.startDate)}</td>
                                            <td>{formatDate(sub.endDate)}</td>
                                            <td>
                                                <span className={`status-badge ${sub.status}`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="empty-state-small">No subscription history.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default MemberMyPlan;