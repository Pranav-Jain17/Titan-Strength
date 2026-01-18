import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MemberHome = () => {
    const [profile, setProfile] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('titanUser');
        return storedUser ? JSON.parse(storedUser).token : null;
    };

    useEffect(() => {
        const fetchHomeData = async () => {
            const token = getAuthToken();
            try {
                const [meRes, subRes, statsRes] = await Promise.all([
                    fetch('https://titan-strength.me/api/v1/members/me', { headers: { Authorization: `Bearer ${token}` } }),
                    fetch('https://titan-strength.me/api/v1/members/subscription', { headers: { Authorization: `Bearer ${token}` } }),
                    fetch('https://titan-strength.me/api/v1/members/stats', { headers: { Authorization: `Bearer ${token}` } })
                ]);

                const meData = await meRes.json();
                const subData = await subRes.json();
                const statsData = await statsRes.json();

                if (meData.success) setProfile(meData.data);
                if (subData.success) setSubscription(subData.data);
                if (statsData.success) setStats(statsData.data);

            } catch (error) {
                toast.error("Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    if (loading) return <p className="loading-text">Loading profile...</p>;

    return (
        <section className="dashboard-section fade-in">
            <div className="section-header-flex">
                <h2>Welcome, {profile?.name}</h2>
            </div>

            <div className="cards-grid">
                <div className="dashboard-card profile-card">
                    <div className="profile-info">
                        <h3>My Profile</h3>
                        <p><strong>Email:</strong> {profile?.email}</p>
                        <p><strong>Goal:</strong> {profile?.goal || 'Not set'}</p>
                        <p><strong>Current Weight:</strong> {profile?.currentWeight ? `${profile.currentWeight} kg` : 'N/A'}</p>
                    </div>
                </div>

                <div className="dashboard-card stat-card">
                    <h3>Current Plan</h3>
                    {subscription ? (
                        <>
                            <p className="stat-text highlight">{subscription.planName}</p>
                            <span className={`status-badge ${subscription.status}`}>
                                {subscription.status}
                            </span>
                            <p className="expiry-text">
                                Ends: {new Date(subscription.endDate).toLocaleDateString()}
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="stat-text">No Active Plan</p>
                            <span className="status-badge expired">Inactive</span>
                        </>
                    )}
                </div>

                <div className="dashboard-card stat-card">
                    <h3>Monthly Activity</h3>
                    <p className="stat-number">{stats?.attendanceThisMonth || 0}</p>
                    <p className="stat-label">Visits this Month</p>
                </div>
            </div>
        </section>
    );
};

export default MemberHome;