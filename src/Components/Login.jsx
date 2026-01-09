import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Styles/login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login Attempt:", { email, password });
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
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="forgot-password-container">
                        <Link to="/forgot-password" className="link-text">
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" className="login-submit-btn">
                        Sign In
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