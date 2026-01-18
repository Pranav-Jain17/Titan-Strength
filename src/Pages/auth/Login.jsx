import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/AuthContext.jsx';
import '../../Styles/login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login: contextLogin } = useAuth();
    const { isLoggedin, user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isLoggedin && user) {
            const role = user.role || 'member';
            navigate('/', { replace: true });;
        }
    }, [isLoggedin, user, navigate]);

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
                const userData = {
                    token: data.token,
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    role: data.user.role
                };

                contextLogin(userData);

                toast.success("Login successful!");
                navigate('/', { replace: true });

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

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Welcome Back</h2>
                <p className="subtitle">Please enter your details to sign in</p>

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
                            autoComplete='email'
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
                                autoComplete='password'
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
                        <Link
                            to="/forgot-password"
                            className="link-text"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" className="login-submit-btn" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="signup-footer">
                    <span className="text-muted">Don't have an account? </span>
                    <Link to="/signup" className="link-text bold">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;