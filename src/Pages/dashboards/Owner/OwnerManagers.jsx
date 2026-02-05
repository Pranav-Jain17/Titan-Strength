import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './ownerManagers.css';

const OwnerManagers = () => {
    const [managers, setManagers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('titanUser');
        return storedUser ? JSON.parse(storedUser).token : null;
    };

    const token = getAuthToken();

    useEffect(() => {
        fetchManagers();
    }, []);

    const fetchManagers = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://titan-strength.me/api/v1/manager/managers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                setManagers(data.data);
            }
        } catch (error) {
            toast.error("Failed to load managers");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredManagers = managers.filter((mgr) => {
        const term = search.toLowerCase();
        return (
            mgr.name?.toLowerCase().includes(term) ||
            mgr.email?.toLowerCase().includes(term)
        );
    });

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("ID copied to clipboard!");
    };

    const getBranchName = (manager) => {
        if (manager.branch && typeof manager.branch === 'object') return manager.branch.name;
        if (manager.homeBranch && typeof manager.homeBranch === 'object') return manager.homeBranch.name;
        return 'Unassigned';
    };

    return (
        <div className="fade-in">
            <section className="dashboard-section">
                <div className="section-header-flex">
                    <h2>Manager Overview</h2>
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Search managers..."
                            value={search}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                    </div>
                </div>

                {loading ? <p className="loading-text">Loading managers...</p> : (
                    <div className="table-container">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Manager ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Assigned Branch</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredManagers.map(mgr => (
                                    <tr key={mgr._id}>
                                        <td
                                            onClick={() => copyToClipboard(mgr._id)}
                                            className="clickable-id"
                                            title="Click to copy"
                                        >
                                            {mgr._id}
                                        </td>
                                        <td className="fw-500">{mgr.name}</td>
                                        <td>{mgr.email}</td>
                                        <td>
                                            <span className={`branch-badge ${getBranchName(mgr) !== 'Unassigned' ? 'assigned' : 'unassigned'}`}>
                                                {getBranchName(mgr)}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <a href={`mailto:${mgr.email}`} className="btn-secondary">Contact</a>
                                        </td>
                                    </tr>
                                ))}
                                {filteredManagers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="empty-state-small">
                                            {search ? "No managers match your search." : "No managers found."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default OwnerManagers;