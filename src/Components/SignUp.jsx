import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Styles/signUp.css';

const Signup = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('https://titan-strength.me/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: username,
                    email,
                    password
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.data || "Registration successful! Please check your email.");
                navigate('/login');
            } else {
                toast.error(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-card">
                <h2>Create Account</h2>
                <p className="subtitle">Join us and start your journey</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                className="password-input"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle-btn"
                            >
                                {showPassword ? (
                                    <img src="/assets/svg/hidePswd.svg" alt="Hide Password" width="20" height="20" />
                                ) : (
                                    <img src="/assets/svg/showPswd.svg" alt="Show Password" width="20" height="20" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="signup-submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="signup-footer">
                    <span className="text-muted">Already have an account? </span>
                    <Link to="/login" className="bold">
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;