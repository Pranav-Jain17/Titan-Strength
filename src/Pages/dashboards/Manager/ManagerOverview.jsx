import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ManagerOverview = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('titanUser');
        return storedUser ? JSON.parse(storedUser).token : null;
    };

    useEffect(() => {
        const fetchDashboard = async () => {
            const token = getAuthToken();
            try {
                setLoading(true);
                const response = await fetch('https://titan-strength.me/api/v1/dashboards/manager', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const resData = await response.json();
                if (resData.success) {
                    setData(resData.data);
                } else {
                    toast.error(resData.data.message || "Failed to load dashboard");
                }
            } catch (error) {
                toast.error("Network error");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <p className="loading-text">Loading overview...</p>;
    if (!data) return null;

    return (
        <section className="dashboard-section fade-in">
            <div className="section-header-flex">
                <h2>{data.branchName} Overview</h2>
            </div>

            <div className="cards-grid">
                <div className="dashboard-card stat-card">
                    <h3>Total Members</h3>
                    <p className="stat-number">{data.stats?.totalMembers}</p>
                </div>
                <div className="dashboard-card stat-card">
                    <h3>Branch Capacity</h3>
                    <p className="stat-number">{data.stats?.capacity}</p>
                </div>
                <div className="dashboard-card stat-card">
                    <h3>Location</h3>
                    <p className="stat-text">{data.location}</p>
                </div>
            </div>
        </section>
    );
};

export default ManagerOverview;