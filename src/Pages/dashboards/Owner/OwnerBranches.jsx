import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './ownerBranches.css';

const OwnerBranches = () => {
    const [branches, setBranches] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [viewBranch, setViewBranch] = useState(null);

    const [formData, setFormData] = useState({
        name: '', address: '', description: '', phone: '', email: '', manager: '', openingHours: ''
    });

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('titanUser');
        return storedUser ? JSON.parse(storedUser).token : null;
    };

    const token = getAuthToken();

    const fetchBranches = async () => {
        try {
            setLoading(true);
            const timestamp = new Date().getTime();
            const response = await fetch(`https://titan-strength.me/api/v1/branches?t=${timestamp}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setBranches(data.data);
        } catch (error) {
            toast.error("Failed to load branches");
        } finally {
            setLoading(false);
        }
    };

    const fetchManagers = async () => {
        try {
            const response = await fetch(`https://titan-strength.me/api/v1/owner/managers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setManagers(data.data);
        } catch (error) {
            console.error("Failed to load managers");
        }
    };

    const fetchBranchDetails = async (id) => {
        try {
            const response = await fetch(`https://titan-strength.me/api/v1/branches/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setViewBranch(data.data);
                setShowDetailsModal(true);
            }
        } catch (error) {
            toast.error("Failed to load branch details");
        }
    };

    useEffect(() => {
        fetchBranches();
        fetchManagers();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openModal = (item = null) => {
        setIsEditMode(!!item);
        if (item) {
            let addressString = item.address || (item.location?.formattedAddress) || (typeof item.location === 'string' ? item.location : '');
            setFormData({
                name: item.name,
                address: addressString,
                description: item.description || '',
                phone: item.phone || '',
                email: item.email || '',
                manager: item.manager?._id || '',
                openingHours: item.openingHours || ''
            });
            setCurrentId(item._id);
        } else {
            setFormData({ name: '', address: '', description: '', phone: '', email: '', manager: '', openingHours: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setCurrentId(null);
    };

    const closeDetailsModal = () => {
        setShowDetailsModal(false);
        setViewBranch(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isEditMode
                ? `https://titan-strength.me/api/v1/branches/${currentId}`
                : `https://titan-strength.me/api/v1/branches`;
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`Branch ${isEditMode ? 'updated' : 'created'} successfully`);
                fetchBranches();
                closeModal();
            } else {
                throw new Error(data.error || "Operation failed");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const initiateDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const response = await fetch(`https://titan-strength.me/api/v1/branches/${itemToDelete}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Branch deleted");
                fetchBranches();
                setShowDeleteModal(false);
                setItemToDelete(null);
            } else {
                throw new Error(data.error || "Delete failed");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const renderLocation = (branch) => {
        if (branch.address) return branch.address;
        if (branch.location?.formattedAddress) return branch.location.formattedAddress;
        return typeof branch.location === 'string' ? branch.location : "View on Map";
    };

    return (
        <div className="fade-in">
            <section className="dashboard-section">
                <div className="section-header-flex">
                    <h2>Branch Management</h2>
                    <button className="btn-primary-small" onClick={() => openModal()}>+ Add Branch</button>
                </div>
                {loading ? <p className="loading-text">Loading...</p> : (
                    <div className="cards-grid">
                        {branches.map((branch) => (
                            <div key={branch._id} className="dashboard-card">
                                <div className="card-header">
                                    <h3>{branch.name}</h3>
                                    <span className={`status-badge ${branch.isActive ? 'active' : 'inactive'}`}>{branch.isActive ? 'Active' : 'Closed'}</span>
                                </div>
                                <div className="card-body">
                                    <p><strong>Location:</strong> {renderLocation(branch)}</p>
                                    <p><strong>Manager:</strong> {branch.manager?.name || 'Unassigned'}</p>
                                    <p><strong>Phone:</strong> {branch.phone}</p>
                                </div>
                                <div className="card-actions">
                                    <button className="btn-secondary" onClick={() => fetchBranchDetails(branch._id)}>View</button>
                                    <button className="btn-edit" onClick={() => openModal(branch)}>Edit</button>
                                    <button className="btn-delete" onClick={() => initiateDelete(branch._id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                        {branches.length === 0 && <p className="no-data">No branches found.</p>}
                    </div>
                )}
            </section>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <div className="modal-header-modern">
                            <div className="header-title">
                                <h3>{isEditMode ? 'Edit' : 'Add New'} Branch</h3>
                            </div>
                            <button className="close-btn-modern" onClick={closeModal}>&times;</button>
                        </div>
                        <div className="modal-body-content">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group"><label>Branch Name</label><input type="text" name="name" className="form-input" value={formData.name} onChange={handleInputChange} required /></div>
                                <div className="form-group"><label>Address</label><input type="text" name="address" className="form-input" value={formData.address} onChange={handleInputChange} required /></div>
                                <div className="form-group">
                                    <label>Assign Manager</label>
                                    <select
                                        name="manager"
                                        className="form-input"
                                        value={formData.manager}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">-- Select Manager --</option>
                                        {managers.map(mgr => (
                                            <option key={mgr._id} value={mgr._id}>
                                                {mgr.name} ({mgr.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group"><label>Description</label><textarea name="description" className="form-input" value={formData.description} onChange={handleInputChange} rows="3" /></div>
                                <div className="form-row">
                                    <div className="form-group"><label>Phone</label><input type="text" name="phone" className="form-input" value={formData.phone} onChange={handleInputChange} /></div>
                                    <div className="form-group"><label>Email</label><input type="email" name="email" className="form-input" value={formData.email} onChange={handleInputChange} /></div>
                                </div>
                                <div className="form-group"><label>Opening Hours</label><input type="text" name="openingHours" className="form-input" value={formData.openingHours} onChange={handleInputChange} /></div>
                                <button type="submit" className="btn-primary-large full-width form-submit-btn" style={{ marginTop: '20px' }}>{isEditMode ? 'Update' : 'Create'} Branch</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showDetailsModal && viewBranch && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header-modern">
                            <div className="header-title">
                                <h3>{viewBranch.name}</h3>
                                <span className={`status-badge-pill ${viewBranch.isActive ? 'active' : 'inactive'}`}>
                                    {viewBranch.isActive ? 'Active' : 'Closed'}
                                </span>
                            </div>
                            <button className="close-btn-modern" onClick={closeDetailsModal}>&times;</button>
                        </div>

                        <div className="modal-body-content">
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Manager</label>
                                    <div className="info-value manager-highlight">
                                        {viewBranch.manager?.name || 'Unassigned'}
                                    </div>
                                    {viewBranch.manager?.email && <div className="info-sub">{viewBranch.manager.email}</div>}
                                </div>
                                <div className="info-item">
                                    <label>Contact Info</label>
                                    <div className="info-value">{viewBranch.phone || 'N/A'}</div>
                                    <div className="info-sub">{viewBranch.email || 'N/A'}</div>
                                </div>
                                <div className="info-item full-width">
                                    <label>Address</label>
                                    <div className="info-value">{renderLocation(viewBranch)}</div>
                                </div>
                                <div className="info-item full-width">
                                    <label>Opening Hours</label>
                                    <div className="info-value">{viewBranch.openingHours || 'Not specified'}</div>
                                </div>
                            </div>

                            <div className="members-section">
                                <div className="section-title-row">
                                    <h4>Registered Members</h4>
                                    <span className="count-badge">{viewBranch.members?.length || 0}</span>
                                </div>

                                <div className="members-table-container">
                                    {viewBranch.members && viewBranch.members.length > 0 ? (
                                        <table className="members-table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th style={{ textAlign: 'right' }}>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {viewBranch.members.map((member) => (
                                                    <tr key={member._id}>
                                                        <td className="fw-500">{member.name}</td>
                                                        <td className="text-muted-sm">{member.email}</td>
                                                        <td style={{ textAlign: 'right' }}><span className="status-dot active"></span> Active</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="empty-state-small">
                                            <p>No members registered at this branch yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header-modern">
                            <div className="header-title"><h3>Confirm Deletion</h3></div>
                        </div>
                        <div className="modal-body-content">
                            <p className="confirm-text">Are you sure you want to delete this branch? This action cannot be undone.</p>
                            <div className="confirm-actions">
                                <button onClick={() => setShowDeleteModal(false)} className="btn-edit">Cancel</button>
                                <button onClick={confirmDelete} className="btn-delete">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerBranches;