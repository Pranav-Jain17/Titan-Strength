import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MemberActivity = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('titanUser');
        return storedUser ? JSON.parse(storedUser).token : null;
    };

    useEffect(() => {
        const fetchHistory = async () => {
            const token = getAuthToken();
            try {
                const response = await fetch('https://titan-strength.me/api/v1/members/attendance', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setHistory(data.data);
                }
            } catch (error) {
                toast.error("Failed to load attendance history");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <section className="dashboard-section fade-in">
            <div className="section-header-flex">
                <h2>Attendance History</h2>
            </div>

            <div className="table-container">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Check-in Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3" className="text-center">Loading history...</td></tr>
                        ) : (
                            history.map(record => (
                                <tr key={record._id}>
                                    <td>{new Date(record.checkedInAt).toLocaleDateString()}</td>
                                    <td>{new Date(record.checkedInAt).toLocaleTimeString()}</td>
                                    <td><span className="status-dot present"></span> Present</td>
                                </tr>
                            ))
                        )}
                        {!loading && history.length === 0 && <tr><td colSpan="3" className="text-center">No attendance records found</td></tr>}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default MemberActivity;