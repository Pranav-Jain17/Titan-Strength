import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const TrainerOverview = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const storedUser = localStorage.getItem('titanUser');
            const token = storedUser ? JSON.parse(storedUser).token : null;

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const headers = { Authorization: `Bearer ${token}` };

                const [statsRes, scheduleRes] = await Promise.all([
                    fetch('https://titan-strength.me/api/v1/trainers/dashboard', { headers }),
                    fetch('https://titan-strength.me/api/v1/dashboards/trainer', { headers })
                ]);

                const statsData = await statsRes.json();
                const scheduleData = await scheduleRes.json();

                const mergedData = {
                    ...(statsData.success ? statsData.data : {}),
                    ...(scheduleData.success ? scheduleData.data : {}),
                };

                setData(mergedData);

            } catch (err) {
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading-container">Loading Overview...</div>;

    return (
        <section className="dashboard-section">
            <div className="section-header-flex">
                <h2>Trainer Overview</h2>
            </div>

            <div className="cards-grid">
                <div className="dashboard-card stat-card">
                    <h3>Active Clients</h3>
                    <div className="stat-number">{data?.activeClients || 0}</div>
                    <div className="stat-label">Currently Assigned</div>
                </div>
                <div className="dashboard-card stat-card">
                    <h3>Pending Reviews</h3>
                    <div className="stat-number" style={{ color: (data?.pendingReviews || 0) > 0 ? '#e74c3c' : '#2ecc71' }}>
                        {data?.pendingReviews || 0}
                    </div>
                    <div className="stat-label">Clients needing attention</div>
                </div>
            </div>

            <div className="dashboard-card">
                <h3>Today's Classes</h3>
                <div className="table-container">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Time</th>
                                <th>Capacity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data?.todaySchedule && data.todaySchedule.length > 0) ? (
                                data.todaySchedule.map((cls, idx) => (
                                    <tr key={idx}>
                                        <td>{cls.title}</td>
                                        <td>
                                            {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {' - '}
                                            {new Date(cls.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td>{cls.capacity} Max</td>
                                    </tr>
                                ))
                            ) : (data?.upcomingClasses && data.upcomingClasses.length > 0) ? (
                                data.upcomingClasses.map((cls, idx) => (
                                    <tr key={idx}>
                                        <td>{cls.title}</td>
                                        <td>
                                            {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {' - '}
                                            {new Date(cls.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td>{cls.capacity} Max</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>
                                    {data?.messages || "No classes scheduled today"}
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default TrainerOverview;