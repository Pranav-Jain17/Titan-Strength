import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MemberHome = () => {
    const [profile, setProfile] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [stats, setStats] = useState(null);
    const [diet, setDiet] = useState(null);
    const [loading, setLoading] = useState(true);

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('titanUser');
        return storedUser ? JSON.parse(storedUser).token : null;
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = getAuthToken();
            if (!token) return;

            try {
                const headers = { Authorization: `Bearer ${token}` };
                const [meRes, subRes, statsRes, dietRes] = await Promise.all([
                    fetch('https://titan-strength.me/api/v1/members/me', { headers }),
                    fetch('https://titan-strength.me/api/v1/members/subscription', { headers }),
                    fetch('https://titan-strength.me/api/v1/members/stats', { headers }),
                    fetch('https://titan-strength.me/api/v1/content/diets/my-plan', { headers })
                ]);

                const [meData, subData, statsData, dietData] = await Promise.all([
                    meRes.json(), subRes.json(), statsRes.json(), dietRes.json()
                ]);

                if (meData.success) setProfile(meData.data);
                if (subData.success) setSubscription(subData.data);
                if (statsData.success) setStats(statsData.data);
                if (dietData.success) setDiet(dietData.data);

            } catch (error) {
                console.error(error);
                toast.error("Unable to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="loading-container">Loading Dashboard...</div>;

    return (
        <section className="dashboard-section">
            <div className="section-header-flex">
                <h2>Welcome back, {profile?.name?.split(' ')[0]}</h2>
            </div>

            <div className="cards-grid">
                <div className="dashboard-card profile-info">
                    <h3>Member Profile</h3>
                    <div className="profile-details">
                        <p><strong>ID</strong> <span>#{profile?.userId?.substring(20, 24)}</span></p>
                        <p><strong>Branch</strong> <span>{profile?.homeBranch || 'Main Branch'}</span></p>
                        <p><strong>Weight</strong> <span>{profile?.currentWeight ? `${profile.currentWeight} kg` : '--'}</span></p>
                        <p><strong>Goal</strong> <span>{profile?.goal || 'General Fitness'}</span></p>
                    </div>
                </div>

                <div className="dashboard-card stat-card">
                    <h3>Membership Status</h3>
                    {subscription ? (
                        <>
                            <div className="plan-name">{subscription.planName}</div>
                            <span className={`status-badge ${subscription.status}`}>{subscription.status}</span>
                            <p className="expiry-text">Valid until {new Date(subscription.endDate).toLocaleDateString()}</p>
                        </>
                    ) : (
                        <>
                            <div className="plan-name">No Active Plan</div>
                            <span className="status-badge expired">Inactive</span>
                        </>
                    )}
                </div>

                <div className="dashboard-card stat-card">
                    <h3>Monthly Check-ins</h3>
                    <div className="stat-number">{stats?.attendanceThisMonth || 0}</div>
                    <div className="stat-label">Visits in {new Date().toLocaleString('default', { month: 'long' })}</div>
                </div>

                <div className="dashboard-card profile-info">
                    <h3>Nutrition Plan</h3>
                    {diet ? (
                        <div className="profile-details">
                            <p><strong>Plan</strong> <span className="text-highlight">{diet.name || 'Custom'}</span></p>
                            <p><strong>Type</strong> <span>{diet.goalType || 'Personalized'}</span></p>
                            {diet.notes && <p className="text-note">"{diet.notes}"</p>}
                        </div>
                    ) : (
                        <div className="empty-centered">
                            No diet assigned
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default MemberHome;