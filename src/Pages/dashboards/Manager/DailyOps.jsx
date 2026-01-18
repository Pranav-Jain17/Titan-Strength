import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const DailyOps = () => {
    const [userId, setUserId] = useState('');
    const [liveUsers, setLiveUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('titanUser');
        return storedUser ? JSON.parse(storedUser).token : null;
    };

    const fetchLiveAttendance = async () => {
        const token = getAuthToken();
        try {
            const response = await fetch('https://titan-strength.me/api/v1/manager/attendance/live', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setLiveUsers(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLiveAttendance();
        const interval = setInterval(fetchLiveAttendance, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleCheckIn = async (e) => {
        e.preventDefault();
        const token = getAuthToken();
        setLoading(true);
        try {
            const response = await fetch('https://titan-strength.me/api/v1/manager/check-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ userId })
            });
            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                setUserId('');
                fetchLiveAttendance();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Check-in failed");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async (userId) => {
        const token = getAuthToken();
        try {
            const response = await fetch('https://titan-strength.me/api/v1/manager/check-out', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ userId })
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Checked out successfully");
                fetchLiveAttendance();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Check-out failed");
        }
    };

    return (
        <section className="dashboard-section fade-in">
            <div className="ops-container">
                <div className="checkin-panel dashboard-card">
                    <h3>Member Check-In</h3>
                    <form onSubmit={handleCheckIn}>
                        <div className="form-group">
                            <label>User ID / Scan ID</label>
                            <input
                                type="text"
                                className="form-input"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="Enter Member ID"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary-large full-width" disabled={loading}>
                            {loading ? 'Processing...' : 'Check In'}
                        </button>
                    </form>
                </div>

                <div className="live-list-panel">
                    <h3 className="section-subtitle">Live Attendance ({liveUsers.length})</h3>
                    <div className="table-container">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Time In</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {liveUsers.map(record => (
                                    <tr key={record._id}>
                                        <td>{record.user?.name}</td>
                                        <td>{record.user?.role}</td>
                                        <td>{new Date(record.checkedInAt).toLocaleTimeString()}</td>
                                        <td>
                                            <button
                                                className="btn-delete"
                                                style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                                                onClick={() => handleCheckOut(record.user?._id)}
                                            >
                                                Check Out
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {liveUsers.length === 0 && <tr><td colSpan="4" className="text-center">Gym is empty</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DailyOps;