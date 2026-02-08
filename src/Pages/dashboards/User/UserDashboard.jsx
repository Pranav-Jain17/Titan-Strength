import { useState, useEffect } from 'react';
import './userDashboard.css';
import Plans from './Plans';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [selectedGoal, setSelectedGoal] = useState('general');
    const [branches, setBranches] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('titanUser'));
        setUser(storedUser);

        const fetchData = async () => {
            try {
                const [branchesRes, plansRes] = await Promise.all([
                    fetch('https://titan-strength.me/api/v1/branches'),
                    fetch('https://titan-strength.me/api/v1/plans')
                ]);

                const branchesData = await branchesRes.json();
                const plansData = await plansRes.json();

                if (branchesData.success) setBranches(branchesData.data);
                if (plansData.success) setPlans(plansData.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading-screen">Loading your experience...</div>;

    return (
        <div className="user-dash-wrapper">
            <header className="user-dash-header">
                <div className="header-content">
                    <h1>Welcome, {user?.name?.split(' ')[0]}</h1>
                    <p>You are one step away from unlocking your full potential.</p>
                </div>
            </header>

            <main className="user-dash-main">
                <section className="onboarding-section">
                    <h2>1. What is your primary goal?</h2>
                    <div className="goal-grid">
                        {['Muscle Gain', 'Weight Loss', 'Cardio Fitness', 'General Health'].map((goal) => (
                            <div
                                key={goal}
                                className={`goal-card ${selectedGoal === goal ? 'active' : ''}`}
                                onClick={() => setSelectedGoal(goal)}
                            >
                                <span className="goal-icon">
                                    {goal === 'Muscle Gain' ? '💪' :
                                        goal === 'Weight Loss' ? '⚖️' :
                                            goal === 'Cardio Fitness' ? '🏃' : '❤️'}
                                </span>
                                <h3>{goal}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                <Plans plans={plans} user={user} />

                <section className="onboarding-section">
                    <h2>3. Find your Home Gym</h2>
                    <div className="branch-selector">
                        <select className="form-select">
                            <option value="">Select a Branch nearest to you...</option>
                            {branches.map(b => (
                                <option key={b._id} value={b._id}>{b.name} - {b.address}</option>
                            ))}
                        </select>
                        <p className="branch-note">*You can access all branches with a Premium plan.</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default UserDashboard;