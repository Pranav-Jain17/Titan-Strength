import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './memberHome.css';

const MemberHome = () => {
    const [profile, setProfile] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [stats, setStats] = useState(null);
    const [diet, setDiet] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({ currentWeight: '', heightCm: '', goal: '' });

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

                const [meRes, dashboardRes, statsRes, dietRes] = await Promise.all([
                    fetch('https://titan-strength.me/api/v1/members/me', { headers }),
                    fetch('https://titan-strength.me/api/v1/dashboards/member', { headers }),
                    fetch('https://titan-strength.me/api/v1/members/stats', { headers }),
                    fetch('https://titan-strength.me/api/v1/content/diets/my-plan', { headers })
                ]);

                const [meData, dashboardData, statsData, dietData] = await Promise.all([
                    meRes.json(), dashboardRes.json(), statsRes.json(), dietRes.json()
                ]);

                if (meData.success) setProfile(meData.data);

                if (dashboardData.success && dashboardData.data.membership) {
                    setSubscription(dashboardData.data.membership);
                }

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

    const handleEditClick = () => {
        setEditForm({
            currentWeight: profile?.currentWeight || '',
            heightCm: profile?.heightCm || '',
            goal: profile?.goal || ''
        });
        setShowEditModal(true);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const token = getAuthToken();
        try {
            const res = await fetch('https://titan-strength.me/api/v1/members/profile', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json', 
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(editForm)
            });
            const data = await res.json();

            if (data.success) {
                setProfile(data.data);
                toast.success("Profile updated successfully");
                setShowEditModal(false);
            } else {
                toast.error(data.message || "Update failed");
            }
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    if (loading) return <div className="loading-container">Loading Dashboard...</div>;

    return (
        <section className="dashboard-section fade-in">
            <div className="section-header-flex">
                <h2>Welcome back, {profile?.name?.split(' ')[0]}</h2>
            </div>

            <div className="cards-grid">
                <div className="dashboard-card profile-info">
                    <div className="card-header-row">
                        <h3>Member Profile</h3>
                        <button className="btn-icon-edit" onClick={handleEditClick}>Edit</button>
                    </div>
                    <div className="profile-details">
                        <p><strong>ID</strong> <span>#{profile?.userId?.substring(20, 24)}</span></p>
                        <p><strong>Branch</strong> <span>{profile?.homeBranch || 'Main Branch'}</span></p>
                        <p><strong>Weight</strong> <span>{profile?.currentWeight ? `${profile.currentWeight} kg` : '--'}</span></p>
                        <p><strong>Height</strong> <span>{profile?.heightCm ? `${profile.heightCm} cm` : '--'}</span></p>
                        <p><strong>Goal</strong> <span>{profile?.goal || 'General Fitness'}</span></p>
                    </div>
                </div>

                <div className="dashboard-card stat-card">
                    <h3>Membership Status</h3>
                    {subscription ? (
                        <>
                            <div className="plan-name">{subscription.planName}</div>
                            <span className={`status-badge ${subscription.status.toLowerCase()}`}>
                                {subscription.status}
                            </span>
                            <p className="expiry-text">
                                Valid until {new Date(subscription.expiresOn).toLocaleDateString()}
                            </p>
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

            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header-modern">
                            <h3>Update Profile</h3>
                            <button className="close-btn-modern" onClick={() => setShowEditModal(false)}>&times;</button>
                        </div>
                        <div className="modal-body-content">
                            <form onSubmit={handleUpdateProfile}>
                                <div className="form-group">
                                    <label>Current Weight (kg)</label>
                                    <input 
                                        type="number" 
                                        className="form-input" 
                                        value={editForm.currentWeight} 
                                        onChange={(e) => setEditForm({...editForm, currentWeight: e.target.value})} 
                                        placeholder="e.g. 75"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Height (cm)</label>
                                    <input 
                                        type="number" 
                                        className="form-input" 
                                        value={editForm.heightCm} 
                                        onChange={(e) => setEditForm({...editForm, heightCm: e.target.value})} 
                                        placeholder="e.g. 180"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Fitness Goal</label>
                                    <select 
                                        className="form-input" 
                                        value={editForm.goal} 
                                        onChange={(e) => setEditForm({...editForm, goal: e.target.value})}
                                    >
                                        <option value="">Select Goal</option>
                                        <option value="Weight Loss">Weight Loss</option>
                                        <option value="Muscle Gain">Muscle Gain</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="General Fitness">General Fitness</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn-primary-large full-width">Save Changes</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MemberHome;