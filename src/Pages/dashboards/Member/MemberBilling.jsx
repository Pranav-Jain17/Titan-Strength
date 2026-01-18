import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MemberBilling = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            const token = JSON.parse(localStorage.getItem('titanUser'))?.token;
            if (!token) return;

            try {
                const res = await fetch('https://titan-strength.me/api/v1/members/payment-history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) setPayments(data.data);
            } catch (err) {
                toast.error("Failed to load payments");
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    return (
        <section className="dashboard-section">
            <div className="section-header-flex">
                <h2>Billing History</h2>
            </div>

            <div className="table-container">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="table-loading">Loading...</td></tr>
                        ) : payments.length > 0 ? (
                            payments.map((p, idx) => (
                                <tr key={idx}>
                                    <td>{new Date(p.date).toLocaleDateString()}</td>
                                    <td>{p.planName} Subscription</td>
                                    <td className="table-amount">${p.amount}</td>
                                    <td><span className={`status-badge ${p.status === 'active' ? 'active' : 'expired'}`}>{p.status === 'active' ? 'Paid' : p.status}</span></td>
                                    <td className="text-capitalize">{p.paymentMethod || 'Card'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="table-empty">No payment history available</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default MemberBilling;