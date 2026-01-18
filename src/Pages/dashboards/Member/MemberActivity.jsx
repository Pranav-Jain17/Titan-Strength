import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MemberActivity = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = JSON.parse(localStorage.getItem('titanUser'))?.token;
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
        fetchHistory();
    }, []);

    return (
        <section className="dashboard-section">
            <div className="section-header-flex">
                <h2>Attendance History</h2>
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