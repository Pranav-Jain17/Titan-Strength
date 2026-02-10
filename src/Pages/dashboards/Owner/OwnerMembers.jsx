import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './ownerManagers.css';

const OwnerMembers = () => {
    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('titanUser');
        return storedUser ? JSON.parse(storedUser).token : null;
    };

    const token = getAuthToken();

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://titan-strength.me/api/v1/manager/members', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                setMembers(data.data);
            }
        } catch (error) {
            toast.error("Failed to load members");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredMembers = members.filter((member) => {
        const term = search.toLowerCase();
        return (
            member.name?.toLowerCase().includes(term) ||
            member.email?.toLowerCase().includes(term) ||
            member.userId?.toLowerCase().includes(term)
        );
    });

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("ID copied to clipboard!");
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <div className="fade-in">
            <section className="dashboard-section">
                <div className="section-header-flex">
                    <h2>Member Overview</h2>
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={search}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                    </div>
                </div>

                {loading ? <p className="loading-text">Loading members...</p> : (
                    <div className="table-container">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Member ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Expires On</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map(member => (
                                    <tr key={member._id}>
                                        <td
                                            onClick={() => copyToClipboard(member.userId)}
                                            className="clickable-id"
                                            title="Click to copy"
                                        >
                                            {member.userId}
                                        </td>
                                        <td className="fw-500">{member.name}</td>
                                        <td>{member.email}</td>
                                        <td>
                                            <span className={`status-badge ${member.status}`}>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td>{formatDate(member.expiresOn)}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <a href={`mailto:${member.email}`} className="btn-secondary">Contact</a>
                                        </td>
                                    </tr>
                                ))}
                                {filteredMembers.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="empty-state-small">
                                            {search ? "No members match your search." : "No members found."}
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

export default OwnerMembers;