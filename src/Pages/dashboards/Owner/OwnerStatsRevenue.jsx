import { useState, useEffect, useRef, useLayoutEffect } from 'react';
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

const OwnerStatsRevenue = () => {
    const [stats, setStats] = useState(null);
    const [recentSales, setRecentSales] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [monthsRange, setMonthsRange] = useState(6);
    const chartContainerRef = useRef(null);
    const [isChartVisible, setIsChartVisible] = useState(false);

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('titanUser');
        return storedUser ? JSON.parse(storedUser).token : null;
    };

    useLayoutEffect(() => {
        const checkSize = () => {
            if (chartContainerRef.current && chartContainerRef.current.offsetWidth > 0) {
                setIsChartVisible(true);
            }
        };
        checkSize();
        const timer = setTimeout(checkSize, 100);
        const resizeObserver = new ResizeObserver(checkSize);
        if (chartContainerRef.current) {
            resizeObserver.observe(chartContainerRef.current);
        }

        return () => {
            clearTimeout(timer);
            resizeObserver.disconnect();
        };
    }, [revenueData, loading]);

    useEffect(() => {
        const fetchData = async () => {
            const token = getAuthToken();
            try {
                if (stats) setLoading(true);

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
                console.error(error);
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

            <div className="dashboard-card">
                <div
                    ref={chartContainerRef}
                    className="chart-wrapper"
                    style={{ width: '100%', height: '300px', minHeight: '300px' }}
                >
                    {revenueData && revenueData.length > 0 && isChartVisible ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    stroke="#888"
                                    tick={{ fill: '#888', fontSize: 12 }}
                                />
                                <YAxis
                                    stroke="#888"
                                    tick={{ fill: '#888', fontSize: 12 }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '4px' }}
                                    labelStyle={{ color: '#fff' }}
                                    itemStyle={{ color: '#f25f29' }}
                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Bar dataKey="revenue" fill="#f25f29" name="Revenue" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ color: '#666' }}>
                                {revenueData?.length === 0 ? "No revenue data available" : "Loading Chart..."}
                            </p>
                        </div>
                    )}
                </div>
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
                                <td className="price-badge">${sale.plan?.price}</td>
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

export default OwnerStatsRevenue;