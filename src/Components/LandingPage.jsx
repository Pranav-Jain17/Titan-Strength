import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext.jsx';
import '../Styles/landingPage.css';

const LandingPage = () => {
    const { isLoggedin, userData, loading } = useContext(AuthContext);
    const [plans, setPlans] = useState([]);
    const [plansLoading, setPlansLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch('https://titan-strength.me/api/v1/plans');
                const data = await response.json();
                if (data.success) {
                    setPlans(data.data);
                    console.log(data.data);
                }
            } catch (error) {
                console.error("Failed to load plans");
            } finally {
                setPlansLoading(false);
            }
        };

        fetchPlans();
    }, []);

    if (loading) {
        return <div className="landing-page" style={{ minHeight: '100vh', backgroundColor: 'var(--dark-bg)' }}></div>;
    }

    const isAuthenticated = isLoggedin || (userData && Object.keys(userData).length > 0);

    const getDashboardLink = () => {
        if (!isAuthenticated || !userData) return "/signup";
        const role = userData.role || 'user';
        return `/${role}/dashboard`;
    };

    return (
        <div className="landing-page" id="home">

            <header className="hero-section">
                <div className="hero-overlay">
                    <div className="hero-content fade-in-up">
                        <h1 className="hero-title">
                            Your Fitness Journey <br />
                            Starts <span className="text-highlight">Here</span>
                        </h1>
                        <p className="hero-subtitle">
                            Personalized workouts, precision nutrition, and expert coaching.
                            Everything you need to build your legacy.
                        </p>

                        <div className="hero-buttons">
                            <Link to={getDashboardLink()} className="btn-primary-large">
                                {isAuthenticated ? "Go to Dashboard" : "Join Now"}
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <section id="services" className="services-section">
                <div className="section-header">
                    <h4>OUR SERVICE</h4>
                    <h2>Unlock Your Best Self with Our Full Range of Fitness Services</h2>
                </div>

                <div className="services-grid">
                    <div className="service-card" style={{ backgroundImage: "url('/assets/StrengthCardio.png')" }}>
                        <div className="service-overlay">
                            <h3>Strength and Cardio</h3>
                        </div>
                    </div>
                    <div className="service-card" style={{ backgroundImage: "url('/assets/1on1_PT.png')" }}>
                        <div className="service-overlay">
                            <h3>1-on-1 PT</h3>
                        </div>
                    </div>
                    <div className="service-card" style={{ backgroundImage: "url('/assets/GroupFitness.png')" }}>
                        <div className="service-overlay">
                            <h3>Group Fitness Classes</h3>
                        </div>
                    </div>
                    <div className="service-card" style={{ backgroundImage: "url('/assets/NutritionDiet.png')" }}>
                        <div className="service-overlay">
                            <h3>Nutrition and Diet Consultation</h3>
                        </div>
                    </div>
                    <div className="service-card" style={{ backgroundImage: "url('/assets/RecoveryWellness.png')" }}>
                        <div className="service-overlay">
                            <h3>Recovery and Wellness</h3>
                        </div>
                    </div>
                    <div className="service-card" style={{ backgroundImage: "url('/assets/HybridCoaching.png')" }}>
                        <div className="service-overlay">
                            <h3>Online Hybrid Coaching</h3>
                        </div>
                    </div>
                </div>
            </section>

            <section id="about" className="about-section">
                <div className="about-container">
                    <div className="about-content">
                        <h4>ABOUT US</h4>
                        <h2>Fitness with Purpose Results with Support</h2>
                        <p>
                            We provide a holistic approach to fitness that combines physical training, nutritional guidance, and mental resilience.
                            Join a community dedicated to pushing boundaries.
                        </p>
                        <div className="about-stats">
                            <div className="stat-item">
                                <span className="stat-number">30</span>
                                <span className="stat-label">Pro<br />Trainers</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">30k</span>
                                <span className="stat-label">Member<br />Happy</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">10</span>
                                <span className="stat-label">Years<br />Experience</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">5</span>
                                <span className="stat-label">Best<br />Awards</span>
                            </div>
                        </div>
                    </div>
                    <div className="about-video-container">
                        <video autoPlay loop muted playsInline className="about-video-content">
                            <source src="/assets/GymIntro.mp4" type="video/mp4"></source>
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </section>

            <section id="plans" className="pricing-section">
                <div className="section-header">
                    <h4>PRICING</h4>
                    <h2>Flexible Plans For Every Goal</h2>
                </div>
                <div className="pricing-grid">
                    {plansLoading ? (
                        <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888' }}>Loading plans...</p>
                    ) : (
                        plans.map((plan) => (
                            <div
                                key={plan._id}
                                className={`pricing-card ${plan.name.toLowerCase().includes('standard') || plan.name.toLowerCase().includes('gold') ? 'highlight' : ''}`}
                            >
                                {(plan.name.toLowerCase().includes('standard') || plan.name.toLowerCase().includes('gold')) && (
                                    <div className="tag">Best Offer</div>
                                )}
                                <h3>{plan.name}</h3>
                                <div className="price">${plan.price}<span>/mo</span></div>
                                <ul className="features-list">
                                    <li>Access to Gym Equipment</li>
                                    <li>Locker Access</li>
                                    <li>Free Wifi</li>
                                    {plan.features?.includesPersonalTraining
                                        ? <li>Unlimited Personal Training</li>
                                        : <li className="disabled">Personal Trainer</li>
                                    }
                                    {plan.features?.canBookClasses
                                        ? <li>Up to {plan.features.maxClassesPerWeek} Classes/Week</li>
                                        : <li className="disabled">Group Classes</li>
                                    }
                                </ul>
                                <button className={plan.name.toLowerCase().includes('standard') || plan.name.toLowerCase().includes('gold') ? "btn-white-large full-width" : "btn-secondary-large full-width"}>
                                    Choose Plan
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <footer id="contact" className="landing-footer">
                <div className="footer-content">
                    <div className="footer-logo">
                        <h2>Titan<span className="text-highlight">Strength</span></h2>
                        <p>The Gym Next Door — With Results That Go the Distance</p>
                    </div>

                    <div className="footer-action">
                        <a
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=dikshantahalawat8@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary-large"
                        >
                            Contact Us Via Email
                        </a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Titan Strength. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;