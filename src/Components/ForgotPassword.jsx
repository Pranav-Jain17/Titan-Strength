import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Styles/login.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleResetRequest = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('https://titan-strength.me/api/v1/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();

            if (data.success) {
                toast.success(data.message || "Reset link sent to your email!");
                setEmail('');
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
                <h2>Reset Password</h2>
                <p className="subtitle">Enter your email to receive a reset link</p>

                <form onSubmit={handleResetRequest}>
                    <div className="form-group">
                        <label htmlFor="reset-email">Email Address</label>
                        <input
                            type="email"
                            id="reset-email"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            autoComplete='email'
                        />
                    </div>

                    <button type="submit" className="login-submit-btn" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Link
                            to="/login"
                            className="link-text bold"
                        >
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;