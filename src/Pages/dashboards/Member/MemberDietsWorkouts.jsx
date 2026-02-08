import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './memberDietsWorkouts.css';

const MemberDietsWorkouts = () => {
    const [myDiet, setMyDiet] = useState(null);
    const [myWorkout, setMyWorkout] = useState(null);
    const [loading, setLoading] = useState(true);

    const getToken = () => JSON.parse(localStorage.getItem('titanUser'))?.token;

    useEffect(() => {
        const fetchAssignedPlans = async () => {
            const token = getToken();
            try {
                const headers = { Authorization: `Bearer ${token}` };

                const [dietRes, workoutRes] = await Promise.all([
                    fetch('https://titan-strength.me/api/v1/content/diets/my-plan', { headers }),
                    fetch('https://titan-strength.me/api/v1/content/workouts/my-plan', { headers })
                ]);

                const dietData = await dietRes.json();
                const workoutData = await workoutRes.json();

                if (dietData.success) setMyDiet(dietData.data);
                if (workoutData.success) setMyWorkout(workoutData.data);

            } catch (err) {
                toast.error("Failed to load your assigned plans");
            } finally {
                setLoading(false);
            }
        };
        fetchAssignedPlans();
    }, []);

    if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading Your Plans...</p></div>;

    return (
        <section className="dashboard-section">
            <div className="section-header-flex">
                <h2>My Personal Plan</h2>
            </div>

            <div className="cards-grid">
                <div className="dashboard-card plan-card">
                    <div className="card-header-flex">
                        <h3>🥗 Assigned Nutrition</h3>
                        {myDiet && <span className="status-badge active">Active</span>}
                    </div>
                    {myDiet ? (
                        <div className="plan-content">
                            <h4 className="plan-title">{myDiet.name || 'Custom Nutrition Plan'}</h4>
                            {myDiet.goalType && <span className="video-tag">{myDiet.goalType}</span>}

                            <div className="plan-details">
                                <strong>Plan Details:</strong>
                                <p style={{ whiteSpace: 'pre-line' }}>{myDiet.plan || myDiet.description}</p>
                            </div>

                            {myDiet.notes && (
                                <div className="trainer-note">
                                    <strong>Trainer Note:</strong> {myDiet.notes}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No diet plan currently assigned by your trainer.</p>
                        </div>
                    )}
                </div>

                <div className="dashboard-card plan-card">
                    <div className="card-header-flex">
                        <h3>💪 Assigned Workout</h3>
                        {myWorkout && <span className="status-badge active">Active</span>}
                    </div>
                    {myWorkout ? (
                        <div className="plan-content">
                            <h4 className="plan-title">{myWorkout.title || 'Custom Workout Routine'}</h4>

                            {myWorkout.url && !myWorkout.customPlan && (
                                <div className="video-preview-container">
                                    <video
                                        src={myWorkout.url}
                                        controls
                                        className="video-thumbnail"
                                        preload="metadata"
                                    />
                                </div>
                            )}

                            <div className="plan-details">
                                <strong>Routine Details:</strong>
                                <p style={{ whiteSpace: 'pre-line' }}>
                                    {myWorkout.customPlan || myWorkout.description}
                                </p>
                            </div>

                            {myWorkout.tags && (
                                <div className="tag-container">
                                    {myWorkout.tags.map(tag => <span key={tag} className="video-tag">#{tag}</span>)}
                                </div>
                            )}

                            {myWorkout.notes && (
                                <div className="trainer-note">
                                    <strong>Trainer Note:</strong> {myWorkout.notes}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No workout routine currently assigned by your trainer.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default MemberDietsWorkouts;