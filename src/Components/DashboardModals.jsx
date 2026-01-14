import { useState, useEffect } from 'react';
import UpdatePassword from '../Pages/auth/UpdatePassword.jsx';
import '../Styles/dashboardModals.css';

function DashboardModals({ type, onClose, user }) {
    const [settingsTab, setSettingsTab] = useState('general');
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
        if (type) {
            setSettingsTab('general');
            setShowPasswordForm(false);
        }
    }, [type]);

    const handleTabChange = (tab) => {
        setSettingsTab(tab);
        setShowPasswordForm(false);
    };

    if (!type) return null;

    const renderContent = () => {
        switch (type) {
            case "profile":
                return (
                    <div className="profile-modal-content">
                        <div className="profile-header">
                            <div className="profile-avatar-large">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <h3>{user.name}</h3>
                            <p>{user.role || 'Member'}</p>
                        </div>
                        <div className="profile-details-card">
                            <div className="detail-row">
                                <span className="detail-label">Username</span>
                                <span className="detail-value">{user.name}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Email</span>
                                <span className="detail-value">{user.email}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Role</span>
                                <span className="detail-value" style={{ textTransform: 'capitalize' }}>{user.role || 'Member'}</span>
                            </div>
                        </div>
                    </div>
                );
            case "settings":
                return (
                    <div className="settings-container">
                        <h2>Settings</h2>
                        <div className="settings-tabs">
                            <button
                                className={`tab-btn ${settingsTab === 'general' ? 'active' : ''}`}
                                onClick={() => handleTabChange('general')}
                            >
                                General
                            </button>
                            <button
                                className={`tab-btn ${settingsTab === 'security' ? 'active' : ''}`}
                                onClick={() => handleTabChange('security')}
                            >
                                Security
                            </button>
                        </div>
                        <div className="settings-body">
                            {settingsTab === 'general' && (
                                <div className="settings-list fade-in">
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span>General Settings</span>
                                            <small>Preferences coming soon...</small>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {settingsTab === 'security' && (
                                <div className="fade-in">
                                    {!showPasswordForm ? (
                                        <div className="settings-list">
                                            <div className="setting-item">
                                                <div className="setting-info">
                                                    <span>Update Password</span>
                                                    <small>Change your account password securely</small>
                                                </div>
                                                <button
                                                    className="btn-secondary"
                                                    onClick={() => setShowPasswordForm(true)}
                                                >
                                                    Update
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="password-form-container">
                                            <div className="form-header">
                                                <button
                                                    className="btn-back"
                                                    onClick={() => setShowPasswordForm(false)}
                                                    title="Go Back"
                                                >
                                                    ←
                                                </button>
                                                <h4>Change Password</h4>
                                            </div>
                                            <UpdatePassword onClose={onClose} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="modal-backdrop" onClick={(e) => {
            if (e.target.className === 'modal-backdrop') onClose();
        }}>
            <div className="modal-box">
                {renderContent()}

                {type === 'profile' && (
                    <div className="modal-footer">
                        <button className="btn-primary full-width" onClick={onClose}>Close</button>
                    </div>
                )}

                {type === 'settings' && !showPasswordForm && (
                    <div className="modal-footer">
                        <button className="btn-primary full-width" onClick={onClose}>Done</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardModals;