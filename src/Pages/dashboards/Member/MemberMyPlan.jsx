import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MemberMyPlan = () => {
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [subscriptionHistory, setSubscriptionHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = JSON.parse(localStorage.getItem('titanUser'))?.token;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const statusRes = await fetch('https://titan-strength.me/api/v1/members/subscription', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const statusData = await statusRes.json();

                if (statusData.success) {
                    setCurrentSubscription(statusData.data);
                }

                const historyRes = await fetch('https://titan-strength.me/api/v1/subscriptions/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const historyData = await historyRes.json();

                if (historyData.success) {
                    setSubscriptionHistory(historyData.data);
                }

            } catch (error) {
                toast.error("Failed to load plan details");
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchData();
    }, [token]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const isActive = currentSubscription?.status === 'active';

    return (
        <div className="fade-in">
            <h2 style={{ marginBottom: '25px', color: '#fff' }}>My Membership</h2>

            {loading ? <p>Loading plan details...</p> : (
                <>
                    {isActive ? (
                        <div className="dashboard-card" style={{ marginBottom: '40px', maxWidth: '600px', borderColor: 'var(--primary)' }}>
                            <div className="card-header">
                                <h3 style={{ fontSize: '1.5rem' }}>Current Active Plan</h3>
                                <span className="status-badge active">Active</span>
                            </div>
                            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div>
                                    <label style={{ color: '#888', fontSize: '0.85rem' }}>PLAN NAME</label>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                        {currentSubscription.planName}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ color: '#888', fontSize: '0.85rem' }}>VALID UNTIL</label>
                                    <div style={{ fontSize: '1.1rem', color: '#fff' }}>
                                        {formatDate(currentSubscription.endDate)}
                                    </div>
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
                                {subscriptionHistory.length > 0 ? (
                                    subscriptionHistory.map(sub => (
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
                                        <td colSpan="4" className="empty-state-small">No subscription history found.</td>
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