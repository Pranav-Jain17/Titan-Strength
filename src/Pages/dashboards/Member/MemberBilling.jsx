import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MemberBilling = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('titanUser');
        return storedUser ? JSON.parse(storedUser).token : null;
    };

    useEffect(() => {
        const fetchPayments = async () => {
            const token = getAuthToken();
            try {
                const response = await fetch('https://titan-strength.me/api/v1/members/payment-history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setPayments(data.data);
                }
            } catch (error) {
                toast.error("Failed to load payment history");
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    return (
        <section className="dashboard-section fade-in">
            <div className="section-header-flex">
                <h2>Billing & Payments</h2>
            </div>

            <div className="table-container">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Plan</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="text-center">Loading invoices...</td></tr>
                        ) : (
                            payments.map((p, index) => (
                                <tr key={index}>
                                    <td>{new Date(p.date).toLocaleDateString()}</td>
                                    <td>{p.planName}</td>
                                    <td style={{ color: '#f25f29', fontWeight: 'bold' }}>${p.amount}</td>
                                    <td><span className="status-badge active">{p.status}</span></td>
                                </tr>
                            ))
                        )}
                        {!loading && payments.length === 0 && <tr><td colSpan="4" className="text-center">No payment history found</td></tr>}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default MemberBilling;