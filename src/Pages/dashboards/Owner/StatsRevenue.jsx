import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const StatsRevenue = () => {
    const [stats, setStats] = useState(null);
    const [recentSales, setRecentSales] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [monthsRange, setMonthsRange] = useState(6);

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('titanUser');
        return storedUser ? JSON.parse(storedUser).token : null;
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = getAuthToken();
            try {
                setLoading(true);
                const timestamp = new Date().getTime();

                const [dashboardRes, chartRes] = await Promise.all([
                    fetch(`https://titan-strength.me/api/v1/dashboards/owner?t=${timestamp}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`https://titan-strength.me/api/v1/owner/revenue-chart?months=${monthsRange}&t=${timestamp}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                const dashboardData = await dashboardRes.json();
                const chartData = await chartRes.json();

                if (dashboardData.success) {
                    setStats(dashboardData.data.stats);
                    setRecentSales(dashboardData.data.recentSales);
                }

                if (chartData.success) {
                    setRevenueData(chartData.data);
                }

            } catch (error) {
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [monthsRange]);

    if (loading && !stats) return <p className="loading-text">Loading statistics...</p>;

    return (
        <section className="dashboard-section fade-in">
            <div className="section-header-flex">
                <h2>Overview & Revenue</h2>
            </div>

            {stats && (
                <div className="cards-grid">
                    <div className="dashboard-card stat-card">
                        <h3>Total Revenue</h3>
                        <p className="stat-number">${stats.totalRevenue?.toLocaleString()}</p>
                    </div>
                    <div className="dashboard-card stat-card">
                        <h3>Active Members</h3>
                        <p className="stat-number">{stats.totalMembers}</p>
                    </div>
                    <div className="dashboard-card stat-card">
                        <h3>Total Users</h3>
                        <p className="stat-number">{stats.totalUsers}</p>
                    </div>
                    <div className="dashboard-card stat-card">
                        <h3>Branches</h3>
                        <p className="stat-number">{stats.totalBranches}</p>
                    </div>
                </div>
            )}

            <div className="section-header-flex" style={{ marginTop: '40px', marginBottom: '20px' }}>
                <h3 className="section-subtitle" style={{ margin: 0 }}>Revenue Analytics</h3>
                <select
                    className="form-input"
                    style={{ width: 'auto', margin: 0 }}
                    value={monthsRange}
                    onChange={(e) => setMonthsRange(Number(e.target.value))}
                >
                    <option value={3}>Last 3 Months</option>
                    <option value={6}>Last 6 Months</option>
                    <option value={12}>Last 1 Year</option>
                </select>
            </div>

            <div className="dashboard-card" style={{ height: '400px', padding: '20px', marginBottom: '40px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis
                            dataKey="month"
                            stroke="#888"
                            tick={{ fill: '#888' }}
                        />
                        <YAxis
                            stroke="#888"
                            tick={{ fill: '#888' }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '4px' }}
                            labelStyle={{ color: '#fff' }}
                            itemStyle={{ color: '#4caf50' }}
                            formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Legend />
                        <Bar dataKey="revenue" fill="var(--primary-color)" name="Revenue" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <h3 className="section-subtitle">Recent Sales</h3>
            <div className="table-container">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Plan</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentSales.map(sale => (
                            <tr key={sale._id}>
                                <td>{sale.user?.name || 'Unknown'}</td>
                                <td>{sale.plan?.name || 'N/A'}</td>
                                <td className="text-green">${sale.plan?.price}</td>
                                <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {recentSales.length === 0 && <tr><td colSpan="4" className="text-center">No recent sales</td></tr>}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default StatsRevenue;