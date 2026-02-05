import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './ownerSubscriptions.css';

const OwnerSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        planId: '',
        paymentMethod: 'cash'
    });

    const token = JSON.parse(localStorage.getItem('titanUser'))?.token;

    useEffect(() => {
        fetchData();
        fetchPlans();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch('https://titan-strength.me/api/v1/subscriptions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setSubscriptions(data.data);
        } catch (error) {
            toast.error("Error loading subscriptions");
        } finally {
            setLoading(false);
        }
    };

    const fetchPlans = async () => {
        try {
            const res = await fetch('https://titan-strength.me/api/v1/plans', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setPlans(data.data);
        } catch (error) {
            console.error("Error loading plans");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://titan-strength.me/api/v1/subscriptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                toast.success(data.message);
                setShowModal(false);
                setFormData({ email: '', planId: '', paymentMethod: 'cash' });
                fetchData();
            } else {
                throw new Error(data.message || 'Failed to create');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <div className="fade-in">
            <section className="dashboard-section">
                <div className="section-header-flex">
                    <h2>Subscription Manager</h2>
                    <button className="btn-primary-small" onClick={() => setShowModal(true)}>
                        + New Subscription
                    </button>
                </div>

                <div className="table-container">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Plan</th>
                                <th>Status</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.length > 0 ? (
                                subscriptions.map(sub => (
                                    <tr key={sub._id}>
                                        <td>
                                            <div className="fw-500">{sub.user?.name}</div>
                                            <div className="text-muted-sm">{sub.user?.email}</div>
                                        </td>
                                        <td>{sub.plan?.name}</td>
                                        <td>
                                            <span className={`status-badge ${sub.status}`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td>{formatDate(sub.startDate)}</td>
                                        <td>{formatDate(sub.endDate)}</td>
                                        <td style={{ textTransform: 'capitalize' }}>{sub.paymentMethod}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="empty-state-small">No subscriptions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <div className="modal-header-modern">
                            <div className="header-title"><h3>Assign Subscription</h3></div>
                            <button className="close-btn-modern" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <div className="modal-body-content">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>User Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-input"
                                        placeholder="user@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Select Plan</label>
                                    <select
                                        name="planId"
                                        className="form-input"
                                        value={formData.planId}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">-- Choose a Plan --</option>
                                        {plans.map(p => (
                                            <option key={p._id} value={p._id}>
                                                {p.name} - ${p.price} ({p.durationDays} Days)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Payment Method</label>
                                    <select
                                        name="paymentMethod"
                                        className="form-input"
                                        value={formData.paymentMethod}
                                        onChange={handleInputChange}
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="card">Credit Card</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                    </select>
                                </div>

                                <button type="submit" className="btn-primary-large full-width form-submit-btn" style={{ marginTop: '20px' }}>
                                    Confirm Subscription
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerSubscriptions;