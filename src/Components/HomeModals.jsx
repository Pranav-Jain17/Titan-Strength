import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import UpdatePassword from './UpdatePassword';
import './Styles/homeModals.css';

function HomeModals({ type, onClose, user, actions }) {
    const [inputValue, setInputValue] = useState("");
    const [settingsTab, setSettingsTab] = useState('general');
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
        if (type) {
            setInputValue("");
            setSettingsTab('general');
            setShowPasswordForm(false);
        }
    }, [type]);

    const handleTabChange = (tab) => {
        setSettingsTab(tab);
        setShowPasswordForm(false);
    };

    if (!type) return null;

    const handleSubmit = () => {
        if (type === 'create') {
            if (!inputValue) return toast.error("Meet Title is required!");
            actions.create(inputValue);
        } else if (type === 'join') {
            if (!inputValue) return toast.error("Room ID is required.");
            actions.join(inputValue);
        }
    };

    const renderContent = () => {
        switch (type) {
            case "create":
                return (
                    <>
                        <h2>New Meeting</h2>
                        <div className="input-group-modern">
                            <label>Meeting Title</label>
                            <input
                                autoFocus
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                placeholder="e.g. Daily Standup"
                            />
                        </div>
                    </>
                );
            case "join":
                return (
                    <>
                        <h2>Join Meeting</h2>
                        <div className="input-group-modern">
                            <label>Room ID</label>
                            <input
                                autoFocus
                                type="text"
                                inputMode="numeric"
                                value={inputValue}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "" || /^[0-9]+$/.test(val)) setInputValue(val);
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                placeholder="e.g. 123456"
                            />
                        </div>
                    </>
                );
            case "profile":
                return (
                    <div className="profile-modal-content">
                        <div className="profile-header">
                            <div className="profile-avatar-large">
                                <img src="/assets/svg/profile.svg" alt="Avatar" />
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
                                            <small>Coming soon...</small>
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

                {(type === 'create' || type === 'join') && (
                    <div className="modal-footer">
                        <button className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button className="btn-primary" onClick={handleSubmit}>
                            {type === 'create' ? 'Create' : 'Join'}
                        </button>
                    </div>
                )}

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

export default HomeModals;