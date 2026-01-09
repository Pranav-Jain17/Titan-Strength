import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './Styles/homeModals.css';

function HomeModals({ type, onClose, user, actions }) {
    const [settingsTab, setSettingsTab] = useState('general');
    const [isPasswordExpanding, setIsPasswordExpanding] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");

    useEffect(() => {
        if (type) {
            setSettingsTab('general');
            setIsPasswordExpanding(false);
            setNewPassword("");
            setConfirmNewPassword("");
            setCurrentPassword("");
        }
    }, [type]);

    if (!type) return null;

    const handleSubmit = () => {
        if (type === 'settings') {
            if (!currentPassword || !newPassword || !confirmNewPassword) return toast.error("Please fill all fields");
            if (newPassword !== confirmNewPassword) return toast.error("New passwords do not match");
            actions.changePassword(currentPassword, newPassword);
        }
    };

    const renderContent = () => {
        switch (type) {
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
                                            <span>App Version</span>
                                            <small>v1.0.0 (Beta)</small>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {settingsTab === 'security' && (
                                <div className="settings-list fade-in">
                                    {!isPasswordExpanding ? (
                                        <div className="setting-card">
                                            <div className="setting-info">
                                                <span>Password</span>
                                                <small>Protect your account</small>
                                            </div>
                                            <button className="btn-secondary" onClick={() => setIsPasswordExpanding(true)}>Change</button>
                                        </div>
                                    ) : (
                                        <div className="password-form fade-in">
                                            <h4>Change Password</h4>
                                            <input
                                                autoFocus
                                                type="password"
                                                placeholder="Current Password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                            />
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirm New Password"
                                                value={confirmNewPassword}
                                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                            />
                                            <div className="form-actions-inline">
                                                <button className="btn-text" onClick={() => setIsPasswordExpanding(false)}>Cancel</button>
                                                <button className="btn-primary" onClick={handleSubmit}>Update</button>
                                            </div>
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

                {type === 'profile' ? (
                    <div className="modal-footer">
                        <button className="btn-primary full-width" onClick={onClose}>Close</button>
                    </div>
                ) : null}

                {type === 'settings' && !isPasswordExpanding ? (
                    <div className="modal-footer">
                        <button className="btn-primary full-width" onClick={onClose}>Done</button>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default HomeModals;