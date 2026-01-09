import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Styles/login.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isResetMode, setIsResetMode] = useState(false);
    const [resetEmail, setResetEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('https://titan-strength.me/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('loginToken', data.token);

                if (data.user) {
                    localStorage.setItem('userId', data.user.id);
                    localStorage.setItem('userName', data.user.name);
                    localStorage.setItem('userEmail', data.user.email);
                    localStorage.setItem('userRole', data.user.role);
                }

                toast.success("Login successful!");
                navigate('/home');
            } else {
                toast.error(data.message || "Invalid credentials");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetRequest = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('https://titan-strength.me/api/v1/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail })
            });
            const data = await response.json();

            if (data.success) {
                toast.success(data.message || "Reset link sent to your email!");
                setIsResetMode(false);
                setResetEmail('');
            } else {
                toast.error(data.message || "Failed to send reset link.");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>{isResetMode ? "Reset Password" : "Welcome Back"}</h2>
                <p className="subtitle">
                    {isResetMode
                        ? "Enter your email to receive a reset link"
                        : "Please enter your details to sign in"}
                </p>

                {isResetMode ? (
                    <form onSubmit={handleResetRequest}>
                        <div className="form-group">
                            <label htmlFor="reset-email">Email Address</label>
                            <input
                                type="email"
                                id="reset-email"
                                placeholder="Enter your registered email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <button type="submit" className="login-submit-btn" disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <span
                                className="link-text bold"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsResetMode(false)}
                            >
                                Back to Login
                            </span>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit}>
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
                                    placeholder="Enter your password"
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

                        <div className="forgot-password-container">
                            <span
                                className="link-text"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsResetMode(true)}
                            >
                                Forgot Password?
                            </span>
                        </div>

                        <button type="submit" className="login-submit-btn" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                )}

                {!isResetMode && (
                    <div className="signup-footer">
                        <span className="text-muted">Don't have an account? </span>
                        <Link to="/signup" className="link-text bold">
                            Sign up
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;