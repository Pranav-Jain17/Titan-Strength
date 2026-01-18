import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const OwnerPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [formData, setFormData] = useState({
        name: '', price: '', durationDays: '', description: ''
    });

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('titanUser');
        return storedUser ? JSON.parse(storedUser).token : null;
    };

    const token = getAuthToken();

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const timestamp = new Date().getTime();
            const response = await fetch(`https://titan-strength.me/api/v1/plans?t=${timestamp}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setPlans(data.data);
        } catch (error) {
            toast.error("Failed to load plans");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openModal = (item = null) => {
        setIsEditMode(!!item);
        if (item) {
            setFormData({
                name: item.name, price: item.price,
                durationDays: item.durationDays !== undefined ? item.durationDays : '',
                description: item.description || ''
            });
            setCurrentId(item._id);
        } else {
            setFormData({ name: '', price: '', durationDays: '', description: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setCurrentId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isEditMode
                ? `https://titan-strength.me/api/v1/plans/${currentId}`
                : `https://titan-strength.me/api/v1/plans`;
            const method = isEditMode ? 'PUT' : 'POST';

            const bodyData = { ...formData, price: Number(formData.price), durationDays: Number(formData.durationDays) };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(bodyData)
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`Plan ${isEditMode ? 'updated' : 'created'} successfully`);
                fetchPlans();
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
            const response = await fetch(`https://titan-strength.me/api/v1/plans/${itemToDelete}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Plan deleted");
                fetchPlans();
                setShowDeleteModal(false);
                setItemToDelete(null);
            } else {
                throw new Error(data.error || "Delete failed");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="fade-in">
            <section className="dashboard-section">
                <div className="section-header-flex">
                    <h2>Membership Plans</h2>
                    <button className="btn-primary-small" onClick={() => openModal()}>+ Add Plan</button>
                </div>
                {loading ? <p className="loading-text">Loading...</p> : (
                    <div className="cards-grid">
                        {plans.map((plan) => (
                            <div key={plan._id} className="dashboard-card">
                                <div className="card-header">
                                    <h3>{plan.name}</h3>
                                    <span className="price-badge">${plan.price}</span>
                                </div>
                                <div className="card-body">
                                    <p><strong>Duration:</strong> {plan.durationDays || 0} days</p>
                                    <p><strong>Description:</strong> {plan.description?.substring(0, 50)}...</p>
                                </div>
                                <div className="card-actions">
                                    <button className="btn-edit" onClick={() => openModal(plan)}>Edit</button>
                                    <button className="btn-delete" onClick={() => initiateDelete(plan._id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                        {plans.length === 0 && <p className="no-data">No active plans found.</p>}
                    </div>
                )}
            </section>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{isEditMode ? 'Edit' : 'Add New'} Plan</h3>
                            <button className="close-btn" onClick={closeModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group"><label>Plan Name</label><input type="text" name="name" className="form-input" value={formData.name} onChange={handleInputChange} required /></div>
                            <div className="form-row">
                                <div className="form-group"><label>Price ($)</label><input type="number" name="price" className="form-input" value={formData.price} onChange={handleInputChange} required /></div>
                                <div className="form-group"><label>Duration (Days)</label><input type="number" name="durationDays" className="form-input" value={formData.durationDays} onChange={handleInputChange} required /></div>
                            </div>
                            <div className="form-group"><label>Description / Features</label><textarea name="description" className="form-input" value={formData.description} onChange={handleInputChange} rows="4" /></div>
                            <button type="submit" className="btn-primary-large full-width form-submit-btn">{isEditMode ? 'Update' : 'Create'} Plan</button>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content confirm-modal-content">
                        <h3>Confirm Deletion</h3>
                        <p className="confirm-text">Are you sure you want to delete this plan? This action cannot be undone.</p>
                        <div className="confirm-actions">
                            <button onClick={() => setShowDeleteModal(false)} className="btn-edit">Cancel</button>
                            <button onClick={confirmDelete} className="btn-delete">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerPlans;