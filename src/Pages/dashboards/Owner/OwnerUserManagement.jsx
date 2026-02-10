import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './ownerUserManagement.css';

const OwnerUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [viewUser, setViewUser] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [activeTab, setActiveTab] = useState('All');

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('titanUser');
        return storedUser ? JSON.parse(storedUser).token : null;
    };

    const token = getAuthToken();

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://titan-strength.me/api/v1/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserDetails = async (id) => {
        try {
            const response = await fetch(`https://titan-strength.me/api/v1/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setViewUser(data.data);
                setShowDetailsModal(true);
            }
        } catch (error) {
            toast.error("Failed to load user details");
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("ID copied to clipboard!");
    };

    const closeDetailsModal = () => {
        setShowDetailsModal(false);
        setViewUser(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const tabs = ['All', 'Owner', 'Manager', 'Trainer', 'Member', 'User'];

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase()) ||
            user._id?.toLowerCase().includes(search.toLowerCase());

        const matchesRole = activeTab === 'All' ? true : user.role?.toLowerCase() === activeTab.toLowerCase();

        return matchesSearch && matchesRole;
    });

    return (
        <div className="fade-in">
            <section className="dashboard-section">
                <div className="section-header-flex">
                    <h2>User Management</h2>

                    <div className="header-controls">
                        <div className="filter-tabs">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSearchSubmit} className="search-form">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={handleSearchChange}
                                className="search-input"
                            />
                        </form>
                    </div>
                </div>

                {loading ? <p className="loading-text">Loading users...</p> : (
                    <div className="table-container">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user._id}>
                                        <td
                                            onClick={() => copyToClipboard(user._id)}
                                            className="clickable-id"
                                            title="Click to copy"
                                        >
                                            {user._id}
                                        </td>
                                        <td className="fw-500">{user.name}</td>
                                        <td className="text-muted-sm">{user.email}</td>
                                        <td>
                                            <span className={`status-badge ${user.role}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{formatDate(user.createdAt)}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button className="btn-secondary" onClick={() => fetchUserDetails(user._id)}>View</button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="empty-state-small">
                                            {search || activeTab !== 'All' ? "No users match your filters." : "No users found."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {showDetailsModal && viewUser && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header-modern">
                            <div className="header-title">
                                <h3>{viewUser.name}</h3>
                                <span className={`status-badge-pill active`}>{viewUser.role}</span>
                            </div>
                            <button className="close-btn-modern" onClick={closeDetailsModal}>&times;</button>
                        </div>

                        <div className="modal-body-content">
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Email</label>
                                    <div className="info-value">{viewUser.email}</div>
                                </div>
                                <div className="info-item">
                                    <label>User ID</label>
                                    <div className="info-sub" onClick={() => copyToClipboard(viewUser._id)} style={{ cursor: 'pointer' }} title="Click to copy">
                                        {viewUser._id}
                                    </div>
                                </div>
                                <div className="info-item">
                                    <label>Role</label>
                                    <div className="info-value" style={{ textTransform: 'capitalize' }}>{viewUser.role}</div>
                                </div>
                                <div className="info-item">
                                    <label>Date Joined</label>
                                    <div className="info-value">{formatDate(viewUser.createdAt)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerUserManagement;