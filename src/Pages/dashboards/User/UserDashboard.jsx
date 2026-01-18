import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './userDashboard.css';

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

    const handleSubscribe = (planId, planName) => {
        toast.info(`Redirecting to payment for ${planName}...`);
    };

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

                <section className="onboarding-section">
                    <h2>2. Choose your Membership</h2>
                    <div className="plans-grid">
                        {plans.length > 0 ? plans.map((plan) => {
                            const isStandard = plan.name === 'Standard';
                            return (
                                <div
                                    key={plan._id}
                                    className={`plan-card ${isStandard ? 'highlighted' : ''}`}
                                >
                                    {isStandard && (
                                        <div className="best-offer-badge">Best Offer</div>
                                    )}

                                    <div className="plan-header">
                                        <h3>{plan.name}</h3>
                                        <div className="price">
                                            ${plan.price}<span className="duration">/mo</span>
                                        </div>
                                    </div>

                                    <div className="plan-divider"></div>

                                    <ul className="plan-features">
                                        <li>Access to Gym Equipment</li>
                                        <li>Locker Access</li>
                                        <li>Free Wifi</li>

                                        {plan.features.includesPersonalTraining && (
                                            <li>Personal Trainer</li>
                                        )}

                                        {plan.features.canBookClasses && (
                                            <li>Up to {plan.features.maxClassesPerWeek} Classes/Week</li>
                                        )}

                                        {plan.features.accessAllBranches && (
                                            <li>Access All Branches</li>
                                        )}

                                        {plan.description && plan.description.split(/,|\n/).map((feature, i) => (
                                            feature.trim() && !feature.toLowerCase().includes('trainer') && !feature.toLowerCase().includes('classes') && (
                                                <li key={i}>{feature.trim()}</li>
                                            )
                                        ))}
                                    </ul>

                                    <button
                                        className="btn-choose-plan"
                                        onClick={() => handleSubscribe(plan._id, plan.name)}
                                    >
                                        CHOOSE PLAN
                                    </button>
                                </div>
                            );
                        }) : (
                            <p className="no-plans">No plans available at the moment.</p>
                        )}
                    </div>
                </section>

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