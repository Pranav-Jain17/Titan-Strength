import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';
import '../../Styles/verifyEmail.css';

const VerifyEmail = () => {
    const { token } = useParams();
    const { verifyEmail } = useAuth();
    const navigate = useNavigate();

    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }

        verifyEmail(token)
            .then((data) => {
                setStatus('success');
                setMessage(data.data || 'Email verified successfully!');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            })
            .catch((error) => {
                setStatus('error');
                setMessage(error.message || 'Verification failed. Please try again.');
            });
    }, [token, verifyEmail, navigate]);

    return (
        <div className="verify-container">
            <div className="verify-card">
                <div className="verify-icon-container">
                    {status === 'verifying' && <div className="spinner"></div>}

                    {status === 'success' && (
                        <svg className="status-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    )}

                    {status === 'error' && (
                        <svg className="status-icon error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                    )}
                </div>

                <h2 className="verify-title">
                    {status === 'verifying' && 'Just a moment'}
                    {status === 'success' && 'Verified!'}
                    {status === 'error' && 'Verification Failed'}
                </h2>

                <p className="verify-message">{message}</p>

                {status === 'success' && (
                    <p className="verify-subtext">Redirecting to login...</p>
                )}

                {status === 'error' && (
                    <button onClick={() => navigate('/login')} className="verify-btn">
                        Return to Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;