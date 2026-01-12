import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Styles/login.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!token) {
        return (
            <div className="login-page">
                <div className="login-card" style={{ textAlign: 'center' }}>
                    <h2 style={{ color: '#e63946' }}>Invalid Link</h2>
                    <p className="subtitle">
                        This password reset link is invalid or has expired.
                    </p>
                    <button
                        className="login-submit-btn"
                        onClick={() => navigate('/login')}
                        style={{ marginTop: '20px' }}
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`https://titan-strength.me/api/v1/auth/reset-password/${token}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newPassword: password,
                    confirmPassword
                }),
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server returned a non-JSON response. Check your API URL and Method.");
            }

            const data = await response.json();

            if (data.success) {
                toast.success("Password reset successful! Please login.");
                navigate('/login');
            } else {
                toast.error(data.message || data.error || "Failed to reset password.");
            }
        } catch (error) {
            console.error("Reset Password Error:", error);
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Set New Password</h2>
                <p className="subtitle">Please create a new, strong password.</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        autoComplete="username"
                        style={{ display: 'none' }}
                    />

                    <div className="form-group">
                        <label htmlFor="new-password">New Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="new-password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                className="password-input"
                                autoComplete="new-password"
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

                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirm-password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                className="password-input"
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="password-toggle-btn"
                            >
                                {showConfirmPassword ? (
                                    <img src="/assets/svg/hidePswd.svg" alt="Hide Password" width="20" height="20" />
                                ) : (
                                    <img src="/assets/svg/showPswd.svg" alt="Show Password" width="20" height="20" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="login-submit-btn"
                        disabled={isLoading}
                        style={{ opacity: isLoading ? 0.7 : 1, marginTop: '10px' }}
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;