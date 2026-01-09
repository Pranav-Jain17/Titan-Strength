import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Styles/homeModals.css';

function HomeModals({ type, onClose, user, actions }) {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");
    const [settingsTab, setSettingsTab] = useState('general');

    useEffect(() => {
        if (type) {
            setInputValue("");
            setSettingsTab('general');
        }
    }, [type]);

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
                            <button className={`tab-btn ${settingsTab === 'general' ? 'active' : ''}`} onClick={() => setSettingsTab('general')}>General</button>
                            <button className={`tab-btn ${settingsTab === 'security' ? 'active' : ''}`} onClick={() => setSettingsTab('security')}>Security</button>
                        </div>
                        <div className="settings-body">
                            {settingsTab === 'general' && (
                                <div className="settings-list fade-in">
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span>On the way ...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {settingsTab === 'security' && (
                                <div className="settings-list fade-in">
                                    <div className="setting-card">
                                        <div className="setting-info">
                                            <span>Password</span>
                                            <small>Protect your account</small>
                                        </div>
                                        <button
                                            className="btn-secondary"
                                            onClick={() => {
                                                onClose();
                                                navigate('/reset-password');
                                            }}
                                        >
                                            Reset
                                        </button>
                                    </div>
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

                {type === 'create' || type === 'join' ? (
                    <div className="modal-footer">
                        <button className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button className="btn-primary" onClick={handleSubmit}>
                            {type === 'create' ? 'Create' : 'Join'}
                        </button>
                    </div>
                ) : null}

                {type === 'profile' ? (
                    <div className="modal-footer">
                        <button className="btn-primary full-width" onClick={onClose}>Close</button>
                    </div>
                ) : null}

                {type === 'settings' ? (
                    <div className="modal-footer">
                        <button className="btn-primary full-width" onClick={onClose}>Done</button>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default HomeModals;