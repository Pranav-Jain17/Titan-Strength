import { useState, useEffect, useCallback, useMemo } from 'react';
import './trainerContent.css';

const TrainerContent = () => {
    const API_URL = 'https://titan-strength.me/api/v1/content/videos';
    const getToken = () => JSON.parse(localStorage.getItem('titanUser'))?.token;

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const initialFormState = useMemo(() => ({
        title: '',
        description: '',
        tags: '',
        active: true,
        file: null
    }), []);

    const [formData, setFormData] = useState(initialFormState);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
    }, []);

    const fetchVideos = useCallback(async (isInitial = false) => {
        if (isInitial) setLoading(true);
        setFetchError(null);

        try {
            const response = await fetch(API_URL, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            const result = await response.json();

            if (response.ok && result.success) {
                setVideos(result.data);
            } else {
                throw new Error(result.message || 'Failed to fetch library');
            }
        } catch (err) {
            setFetchError(err.message);
            if (!isInitial) showToast(err.message, 'danger');
        } finally {
            setLoading(false);
        }
    }, [API_URL, showToast]);

    useEffect(() => {
        fetchVideos(true);
    }, [fetchVideos]);

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
        }));
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData(initialFormState);
    };

    const openEdit = (video) => {
        setEditingId(video._id);
        setFormData({
            title: video.title,
            description: video.description,
            tags: video.tags?.join(', ') || '',
            active: video.active,
            file: null
        });
        setShowModal(true);
    };

    const confirmDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${itemToDelete}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            const result = await response.json();

            if (result.success) {
                showToast('Deleted successfully');
                setVideos(prev => prev.filter(v => v._id !== itemToDelete));
                setShowDeleteModal(false);
                setItemToDelete(null);
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            showToast(err.message, 'danger');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'file') {
                if (formData.file) data.append('videoFile', formData.file);
            } else {
                data.append(key, formData[key]);
            }
        });

        const url = editingId ? `${API_URL}/${editingId}` : API_URL;
        const method = editingId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                body: data,
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });

            if (response.status === 413) {
                throw new Error('File exceeds 100MB limit');
            }

            const result = await response.json();

            if (response.ok && result.success) {
                showToast(editingId ? 'Updated successfully' : 'Uploaded successfully');
                closeModal();
                fetchVideos();
            } else {
                throw new Error(result.message || `Status: ${response.status}`);
            }
        } catch (err) {
            showToast(err.message, 'danger');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-section">
            {toast.show && (
                <div className="toast-container-top">
                    <div className={`toast-popup ${toast.type}`}>
                        <span className="toast-icon">{toast.type === 'danger' ? '✕' : '✓'}</span>
                        {toast.message}
                    </div>
                </div>
            )}

            <div className="section-header-flex">
                <h2>Video Library</h2>
                <button className="btn-primary" onClick={() => setShowModal(true)} disabled={loading}>
                    + Add New Video
                </button>
            </div>

            {loading && videos.length === 0 ? (
                <div className="loading-spinner-container">
                    <div className="spinner"></div>
                    <p>Syncing Library...</p>
                </div>
            ) : fetchError ? (
                <div className="error-state">
                    <p>{fetchError}</p>
                    <button className="btn-outline" onClick={() => fetchVideos(true)}>Retry Connection</button>
                </div>
            ) : (
                <div className="cards-grid">
                    {videos.length === 0 && <p className="empty-msg">No videos found in library.</p>}

                    {videos.map((video) => (
                        <div key={video._id} className="dashboard-card">
                            <div className="card-header-flex">
                                <span className={`status-badge ${video.active ? 'active' : 'inactive'}`}>
                                    {video.active ? 'Active' : 'Hidden'}
                                </span>
                            </div>

                            {video.videoUrl && (
                                <div className="video-preview-container">
                                    <video
                                        src={video.videoUrl}
                                        className="video-thumbnail"
                                        controls
                                        preload="metadata"
                                    />
                                </div>
                            )}

                            <div className="card-body">
                                <h3 className="video-title">{video.title}</h3>
                                <p className="video-desc">{video.description}</p>

                                <div className="tag-container">
                                    {video.tags?.map(tag => (
                                        <span key={tag} className="video-tag">#{tag}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="card-actions">
                                <button className="btn-outline" onClick={() => openEdit(video)}>Edit</button>
                                <button className="btn-outline danger" onClick={() => confirmDelete(video._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">{editingId ? 'Edit Video' : 'Upload Video'}</h3>
                            <button className="btn-close" onClick={closeModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input className="form-input" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Enter video title" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-textarea" name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Enter video description" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tags</label>
                                <input className="form-input" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="e.g. Strength, HIIT, Legs" />
                            </div>
                            <div className="form-group">
                                <div className="file-upload-header">
                                    <label className="form-label">Video File</label>
                                    <span className="file-limit-badge">Max 100MB</span>
                                </div>
                                <input type="file" className="form-input" name="file" onChange={handleInputChange} accept="video/*" />
                                {editingId && <small className="form-hint">Leave blank to keep current video</small>}
                            </div>
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input type="checkbox" name="active" checked={formData.active} onChange={handleInputChange} />
                                    Visible to members
                                </label>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                                {loading ? 'Processing...' : editingId ? 'Update Video' : 'Upload Video'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content delete-confirm">
                        <div className="modal-header">
                            <h3 className="modal-title">Confirm Deletion</h3>
                            <button className="btn-close" onClick={() => setShowDeleteModal(false)}>&times;</button>
                        </div>
                        <p style={{ margin: '1.5rem 0', color: 'var(--text-gray)' }}>
                            Are you sure you want to permanently delete this video? This action cannot be undone.
                        </p>
                        <div className="card-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
                            <button className="btn-outline" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn-primary danger" style={{ background: 'var(--danger-color)' }} onClick={handleDelete} disabled={loading}>
                                {loading ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainerContent;