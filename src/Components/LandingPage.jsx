import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext.jsx';
import '../Styles/landingPage.css';

const LandingPage = () => {
    const { isLoggedin, userData, loading } = useContext(AuthContext);

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
        <div className="landing-page">

            <header className="hero-section">
                <div className="hero-overlay">
                    <div className="hero-content fade-in-up">
                        <h1 className="hero-title">
                            UNLEASH YOUR INNER <span className="text-highlight">TITAN</span>
                        </h1>
                        <p className="hero-subtitle">
                            Personalized workouts, precision nutrition, and expert coaching.
                            Everything you need to build your legacy.
                        </p>

                        <div className="hero-buttons">
                            <Link to={getDashboardLink()} className="btn-primary-large">
                                {isAuthenticated ? "Go to Dashboard" : "Start Your Journey"}
                            </Link>
                            {!isAuthenticated && (
                                <Link to="/login" className="btn-secondary-large">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>


            <section className="features-section">
                <div className="section-header">
                    <h2>Why Choose Titan Strength?</h2>
                    <div className="underline"></div>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="icon-box">🏋️</div>
                        <h3>Custom Workouts</h3>
                        <p>Tailored exercise plans designed by expert trainers to match your fitness level and goals.</p>
                    </div>

                    <div className="feature-card">
                        <div className="icon-box">🥗</div>
                        <h3>Smart Nutrition</h3>
                        <p>Track your macros and get personalized diet plans to fuel your body for peak performance.</p>
                    </div>

                    <div className="feature-card">
                        <div className="icon-box">📊</div>
                        <h3>Progress Tracking</h3>
                        <p>Visualize your gains with advanced analytics. See how far you've come and where you're going.</p>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <h2>Ready to Transform?</h2>
                <p>Join thousands of Titans building their dream physique today.</p>
                <Link to="/signup" className="btn-white-large">
                    Join Now - It's Free
                </Link>
            </section>

            <footer className="landing-footer">
                <p>&copy; {new Date().getFullYear()} Titan Strength. All rights reserved.</p>
                <div className="social-links">
                    <span>Instagram</span>
                    <span>Twitter</span>
                    <span>Facebook</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;