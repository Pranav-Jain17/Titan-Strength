import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [filter, setFilter] = useState('active');
    const [selectedMember, setSelectedMember] = useState(null);
    const [profileData, setProfileData] = useState(null);

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('titanUser');
        return storedUser ? JSON.parse(storedUser).token : null;
    };

    const fetchMembers = async () => {
        const token = getAuthToken();
        try {
            const response = await fetch(`https://titan-strength.me/api/v1/manager/members?status=${filter}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setMembers(data.data);
        } catch (error) {
            toast.error("Failed to load members");
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [filter]);

    const viewProfile = async (id) => {
        const token = getAuthToken();
        try {
            const response = await fetch(`https://titan-strength.me/api/v1/manager/members/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setProfileData(data.data);
                setSelectedMember(id);
            }
        } catch (error) {
            toast.error("Could not load profile");
        }
    };

    return (
        <section className="dashboard-section fade-in">
            <div className="section-header-flex">
                <h2>Members</h2>
                <div className="filter-group">
                    <button className={`btn-filter ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active</button>
                    <button className={`btn-filter ${filter === 'expired' ? 'active' : ''}`} onClick={() => setFilter('expired')}>Expired</button>
                </div>
            </div>

            <div className="table-container">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Expiry Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(m => (
                            <tr key={m._id}>
                                <td>{m.userId}</td>
                                <td>{m.name}</td>
                                <td>{m.email}</td>
                                <td style={{ textTransform: 'capitalize' }}>{m.role}</td>
                                <td><span className={`status-badge ${m.status}`}>{m.status}</span></td>
                                <td>{m.expiresOn ? new Date(m.expiresOn).toLocaleDateString() : 'N/A'}</td>
                                <td><button className="btn-edit" onClick={() => viewProfile(m._id)}>Profile</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedMember && profileData && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{profileData.member.name}</h3>
                            <button className="close-btn" onClick={() => { setSelectedMember(null); setProfileData(null); }}>&times;</button>
                        </div>
                        <div className="profile-details">
                            <p><strong>User ID:</strong> {profileData.member._id}</p>
                            <p><strong>Email:</strong> {profileData.member.email}</p>
                            <p><strong>Role:</strong> {profileData.member.role}</p>

                            <h4 style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '10px' }}>Subscription History</h4>
                            <ul className="history-list">
                                {profileData.subscriptions && profileData.subscriptions.length > 0 ? (
                                    profileData.subscriptions.map(sub => (
                                        <li key={sub._id}>
                                            <span style={{ color: '#f25f29' }}>{sub.plan?.name || 'Unknown Plan'}</span>
                                            <span style={{ float: 'right', fontSize: '0.85rem', color: '#888' }}>
                                                {new Date(sub.createdAt).toLocaleDateString()}
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <li>No subscription history found.</li>
                                )}
                            </ul>

                            <h4 style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '10px' }}>Recent Attendance</h4>
                            <ul className="history-list">
                                {profileData.attendanceHistory && profileData.attendanceHistory.length > 0 ? (
                                    profileData.attendanceHistory.slice(0, 5).map(att => (
                                        <li key={att._id}>
                                            Checked In
                                            <span style={{ float: 'right', fontSize: '0.85rem', color: '#888' }}>
                                                {new Date(att.checkedInAt).toLocaleString()}
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <li>No attendance records found.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Members;