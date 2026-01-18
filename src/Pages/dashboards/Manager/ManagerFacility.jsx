import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Facility = () => {
    const [equipments, setEquipments] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const [equipForm, setEquipForm] = useState({ name: '', tag: '' });
    const [maintForm, setMaintForm] = useState({ equipmentId: '', description: '' });

    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', tag: '', status: '' });
    const [showEditModal, setShowEditModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('titanUser');
        return storedUser ? JSON.parse(storedUser).token : null;
    };

    const fetchEquipment = async () => {
        const token = getAuthToken();
        try {
            setLoading(true);
            let url = 'https://titan-strength.me/api/v1/manager/equipment';
            if (filterStatus) {
                url += `?status=${filterStatus}`;
            }

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setEquipments(data.data);
            }
        } catch (error) {
            toast.error("Failed to load equipment list");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEquipment();
    }, [filterStatus]);

    const handleAddEquipment = async (e) => {
        e.preventDefault();
        const token = getAuthToken();
        try {
            const res = await fetch('https://titan-strength.me/api/v1/manager/equipment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(equipForm)
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Equipment Added");
                setEquipForm({ name: '', tag: '' });
                fetchEquipment();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Failed to add equipment");
        }
    };

    const initiateDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        const token = getAuthToken();
        try {
            const res = await fetch(`https://titan-strength.me/api/v1/manager/equipment/${deleteId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Equipment Deleted");
                fetchEquipment();
                setShowDeleteModal(false);
                setDeleteId(null);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Failed to delete equipment");
        }
    };

    const openEditModal = (item) => {
        setIsEditMode(true);
        setEditId(item._id);
        setEditForm({ name: item.name, tag: item.tag || '', status: item.status });
        setShowEditModal(true);
    };

    const handleUpdateEquipment = async (e) => {
        e.preventDefault();
        const token = getAuthToken();
        try {
            const res = await fetch(`https://titan-strength.me/api/v1/manager/equipment/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(editForm)
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Equipment Updated");
                setShowEditModal(false);
                fetchEquipment();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Failed to update equipment");
        }
    };

    const handleReport = async (e) => {
        e.preventDefault();
        const token = getAuthToken();
        try {
            const res = await fetch('https://titan-strength.me/api/v1/manager/maintenance/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(maintForm)
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Maintenance Reported");
                setMaintForm({ equipmentId: '', description: '' });
                fetchEquipment();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Failed to report issue");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'working': return '#28a745';
            case 'maintenance': return '#ffc107';
            case 'out_of_order': return '#dc3545';
            default: return '#ccc';
        }
    };

    return (
        <section className="dashboard-section fade-in">
            <div className="section-header-flex">
                <h2>Equipment Inventory</h2>
                <div className="filter-group">
                    <button className={`btn-filter ${filterStatus === '' ? 'active' : ''}`} onClick={() => setFilterStatus('')}>All</button>
                    <button className={`btn-filter ${filterStatus === 'working' ? 'active' : ''}`} onClick={() => setFilterStatus('working')}>Working</button>
                    <button className={`btn-filter ${filterStatus === 'maintenance' ? 'active' : ''}`} onClick={() => setFilterStatus('maintenance')}>Maintenance</button>
                    <button className={`btn-filter ${filterStatus === 'out_of_order' ? 'active' : ''}`} onClick={() => setFilterStatus('out_of_order')}>Out of Order</button>
                </div>
            </div>

            <div className="table-container" style={{ marginBottom: '40px' }}>
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Tag / ID</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="text-center">Loading inventory...</td></tr>
                        ) : (
                            equipments.map(item => (
                                <tr key={item._id}>
                                    <td>{item.name}</td>
                                    <td>{item.tag || item._id.substring(item._id.length - 6).toUpperCase()}</td>
                                    <td>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: `${getStatusColor(item.status)}20`,
                                            color: getStatusColor(item.status),
                                            textTransform: 'uppercase',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {item.status.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-edit" onClick={() => openEditModal(item)} style={{ marginRight: '10px' }}>Edit</button>
                                        <button className="btn-delete" onClick={() => initiateDelete(item._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                        {!loading && equipments.length === 0 && <tr><td colSpan="4" className="text-center">No equipment found.</td></tr>}
                    </tbody>
                </table>
            </div>

            <div className="cards-grid">
                <div className="dashboard-card">
                    <div className="card-header"><h3>Add New Equipment</h3></div>
                    <form onSubmit={handleAddEquipment}>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" className="form-input" value={equipForm.name} onChange={(e) => setEquipForm({ ...equipForm, name: e.target.value })} required placeholder="e.g. Treadmill X1" />
                        </div>
                        <div className="form-group">
                            <label>Tag/ID</label>
                            <input type="text" className="form-input" value={equipForm.tag} onChange={(e) => setEquipForm({ ...equipForm, tag: e.target.value })} placeholder="e.g. TR-001" />
                        </div>
                        <button type="submit" className="btn-primary-large full-width form-submit-btn">Add Equipment</button>
                    </form>
                </div>

                <div className="dashboard-card">
                    <div className="card-header"><h3>Report Maintenance</h3></div>
                    <form onSubmit={handleReport}>
                        <div className="form-group">
                            <label>Select Equipment</label>
                            <select
                                className="form-input"
                                value={maintForm.equipmentId}
                                onChange={(e) => setMaintForm({ ...maintForm, equipmentId: e.target.value })}
                            >
                                <option value="">-- Choose Equipment --</option>
                                {equipments.map(eq => (
                                    <option key={eq._id} value={eq._id}>
                                        {eq.name} ({eq.tag || 'No Tag'})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Issue Description</label>
                            <textarea className="form-input" rows="3" value={maintForm.description} onChange={(e) => setMaintForm({ ...maintForm, description: e.target.value })} required placeholder="Describe the problem..." />
                        </div>
                        <button type="submit" className="btn-delete full-width form-submit-btn">Report Issue</button>
                    </form>
                </div>
            </div>

            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Edit Equipment</h3>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleUpdateEquipment}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" className="form-input" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Tag</label>
                                <input type="text" className="form-input" value={editForm.tag} onChange={(e) => setEditForm({ ...editForm, tag: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select className="form-input" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                                    <option value="working">Working</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="out_of_order">Out of Order</option>
                                </select>
                            </div>
                            <button type="submit" className="btn-primary-large full-width">Update</button>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h3 style={{ color: '#dc3545' }}>Confirm Deletion</h3>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>&times;</button>
                        </div>
                        <div style={{ marginBottom: '25px' }}>
                            <p>Are you sure you want to delete this equipment? This action cannot be undone.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button
                                className="btn-edit full-width"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-delete full-width"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Facility;