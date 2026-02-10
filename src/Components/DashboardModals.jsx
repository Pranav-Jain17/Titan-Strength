import { useState, useEffect, useRef } from 'react';
import UpdatePassword from '../Pages/auth/UpdatePassword.jsx';
import { toast } from 'react-toastify';
import '../Styles/dashboardModals.css';

function DashboardModals({ type, onClose, user }) {
    const [settingsTab, setSettingsTab] = useState('general');
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (type && user) {
            setSettingsTab('general');
            setShowPasswordForm(false);
            setPreviewUrl(user.photoUrl || null);
        }
    }, [type, user]);

    const handleTabChange = (tab) => {
        setSettingsTab(tab);
        setShowPasswordForm(false);
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const updateLocalUser = (newPhotoUrl) => {
        setPreviewUrl(newPhotoUrl);
        const storedUser = JSON.parse(localStorage.getItem('titanUser'));
        if (storedUser) {
            storedUser.photoUrl = newPhotoUrl || '';
            localStorage.setItem('titanUser', JSON.stringify(storedUser));
            window.location.reload();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            setUploading(true);
            const token = JSON.parse(localStorage.getItem('titanUser'))?.token;

            const res = await fetch('https://titan-strength.me/api/v1/users/avatar', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Upload failed');

            if (data.success) {
                toast.success("Profile picture updated!");
                updateLocalUser(data.data.photoUrl);
            }
        } catch (error) {
            toast.error(error.message || "Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleRemovePhoto = async (e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to remove your profile picture?")) return;

        try {
            setUploading(true);
            const token = JSON.parse(localStorage.getItem('titanUser'))?.token;

            const res = await fetch('https://titan-strength.me/api/v1/users/avatar', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Delete failed');

            if (data.success) {
                toast.info("Profile picture removed");
                updateLocalUser(null);
            }
        } catch (error) {
            toast.error(error.message || "Failed to remove image");
        } finally {
            setUploading(false);
        }
    };

    if (!type) return null;

    const renderContent = () => {
        switch (type) {
            case "profile":
                return (
                    <div className="profile-modal-content">
                        <div className="profile-header">
                            <div className="avatar-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                <div
                                    className="profile-avatar-large"
                                    onClick={handleImageClick}
                                    style={{
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    title="Click to change profile picture"
                                >
                                    {uploading ? (
                                        <div className="loading-spinner-small">...</div>
                                    ) : previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Profile"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        user.name ? user.name.charAt(0).toUpperCase() : 'U'
                                    )}

                                    <div className="avatar-overlay">
                                        <span>{previewUrl ? 'Change' : 'Upload'}</span>
                                    </div>
                                </div>

                                {previewUrl && !uploading && (
                                    <button
                                        onClick={handleRemovePhoto}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#ff4d4d',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        Remove Photo
                                    </button>
                                )}
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                accept="image/*"
                            />

                            <h3 style={{ marginTop: '15px' }}>{user.name}</h3>
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