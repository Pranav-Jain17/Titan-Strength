import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MemberActivity = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkInLoading, setCheckInLoading] = useState(false);

    const getToken = () => JSON.parse(localStorage.getItem('titanUser'))?.token;

    const fetchHistory = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const res = await fetch('https://titan-strength.me/api/v1/members/attendance', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setHistory(data.data);
        } catch (err) {
            toast.error("Failed to load attendance");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleCheckIn = async () => {
        const token = getToken();
        if (!token) return;

        setCheckInLoading(true);
        try {
            const res = await fetch('https://titan-strength.me/api/v1/attendance/check-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ note: 'Self check-in' })
            });

            const data = await res.json();

            if (res.status === 403) {
                toast.error(data.message || "Access Denied: No active subscription");
                return;
            }

            if (data.success) {
                toast.success(data.message);
                fetchHistory();
            } else {
                toast.info(data.message);
            }
        } catch (err) {
            toast.error("Check-in failed");
        } finally {
            setCheckInLoading(false);
        }
    };

    return (
        <section className="dashboard-section">
            <div className="section-header-flex">
                <h2>Attendance History</h2>
                <button
                    className="btn-primary"
                    onClick={handleCheckIn}
                    disabled={checkInLoading}
                >
                    {checkInLoading ? 'Processing...' : 'Self Check-In'}
                </button>
            </div>

            <div className="table-container">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3" className="table-loading">Loading...</td></tr>
                        ) : history.length > 0 ? (
                            history.map(record => (
                                <tr key={record._id}>
                                    <td>{new Date(record.checkedInAt).toLocaleDateString()}</td>
                                    <td>{new Date(record.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td><span className="status-badge present">Checked In</span></td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="3" className="table-empty">No records found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default MemberActivity;