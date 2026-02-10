import { useState, useEffect, useRef } from 'react';
import UpdatePassword from '../Pages/auth/UpdatePassword.jsx';
import { toast } from 'react-toastify';
import '../Styles/dashboardModals.css';

function DashboardModals({ type, onClose, user }) {
    const [settingsTab, setSettingsTab] = useState('general');
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showImageOptions, setShowImageOptions] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const galleryInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        if (type && user) {
            setSettingsTab('general');
            setShowPasswordForm(false);
            setShowImageOptions(false);
            setShowCamera(false);
            setShowDeleteConfirm(false);
            setPreviewUrl(user.photoUrl || null);
        }

        return () => {
            stopCameraStream();
        };
    }, [type, user]);

    const handleTabChange = (tab) => {
        setSettingsTab(tab);
        setShowPasswordForm(false);
    };

    const handleImageClick = () => {
        setShowImageOptions(true);
    };

    const handleOptionClose = () => {
        setShowImageOptions(false);
        setShowDeleteConfirm(false);
    };

    const startCamera = async () => {
        setShowImageOptions(false);
        setShowCamera(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            toast.error("Unable to access camera. Please check permissions.");
            setShowCamera(false);
        }
    };

    const stopCameraStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const closeCamera = () => {
        stopCameraStream();
        setShowCamera(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');

            // Mirror image for better UX
            context.translate(canvas.width, 0);
            context.scale(-1, 1);

            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
                uploadFile(file);
                closeCamera();
            }, 'image/jpeg');
        }
    };

    const handleGalleryClick = () => {
        if (galleryInputRef.current) {
            galleryInputRef.current.click();
        }
        setShowImageOptions(false);
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

    const uploadFile = async (file) => {
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        uploadFile(file);
    };

    const handleDeleteClick = () => {
        setShowImageOptions(false);
        setShowDeleteConfirm(true);
    };

    const confirmRemovePhoto = async () => {
        if (!previewUrl) return;

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
            setShowDeleteConfirm(false);
        }
    };

    if (!type) return null;

    const renderContent = () => {
        switch (type) {
            case "profile":
                return (
                    <div className="profile-modal-content">
                        <div className="profile-header">
                            <div className="avatar-section">
                                <div
                                    className="profile-avatar-large"
                                    onClick={handleImageClick}
                                    title="Change Profile Picture"
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
                                        <span>Edit</span>
                                    </div>
                                </div>
                            </div>

                            <input
                                type="file"
                                ref={galleryInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                accept="image/*"
                            />

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

                {showImageOptions && (
                    <div className="image-options-overlay" onClick={handleOptionClose}>
                        <div className="image-options-sheet" onClick={(e) => e.stopPropagation()}>
                            <div className="options-grid">
                                <div className="option-item" onClick={startCamera}>
                                    <div className="option-circle camera-circle">
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                            <path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 11.5V13H9v2.5L5.5 12 9 8.5V11h6V8.5l3.5 3.5-3.5 3.5z" opacity="0" />
                                            <circle cx="12" cy="12" r="3.2" />
                                            <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                                        </svg>
                                    </div>
                                    <span>Camera</span>
                                </div>

                                <div className="option-item" onClick={handleGalleryClick}>
                                    <div className="option-circle gallery-circle">
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                        </svg>
                                    </div>
                                    <span>Gallery</span>
                                </div>

                                {previewUrl && (
                                    <div className="option-item" onClick={handleDeleteClick}>
                                        <div className="option-circle delete-circle">
                                            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                            </svg>
                                        </div>
                                        <span>Remove</span>
                                    </div>
                                )}
                            </div>
                            <button className="cancel-sheet-btn" onClick={handleOptionClose}>Cancel</button>
                        </div>
                    </div>
                )}

                {showDeleteConfirm && (
                    <div className="delete-confirm-overlay" onClick={() => setShowDeleteConfirm(false)}>
                        <div className="delete-confirm-box" onClick={(e) => e.stopPropagation()}>
                            <h4>Remove Profile Picture?</h4>
                            <p>Are you sure you want to remove your current photo?</p>
                            <div className="delete-confirm-actions">
                                <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                                <button className="btn-confirm-delete" onClick={confirmRemovePhoto}>Remove</button>
                            </div>
                        </div>
                    </div>
                )}

                {showCamera && (
                    <div className="camera-overlay">
                        <div className="camera-container">
                            <video ref={videoRef} autoPlay playsInline className="video-feed"></video>
                            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                            <div className="camera-controls">
                                <button className="camera-close-btn" onClick={closeCamera}>&times;</button>
                                <button className="camera-capture-btn" onClick={capturePhoto}></button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default DashboardModals;