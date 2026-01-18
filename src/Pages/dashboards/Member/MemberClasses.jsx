import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MemberClasses = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);

    const getToken = () => JSON.parse(localStorage.getItem('titanUser'))?.token;

    const fetchBookings = async () => {
        const token = getToken();
        if (!token) return;
        try {
            const res = await fetch('https://titan-strength.me/api/v1/members/my-bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setBookings(data.data);
        } catch (err) {
            toast.error("Failed to load schedule");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const initiateCancel = (sessionId) => {
        setBookingToCancel(sessionId);
        setShowModal(true);
    };

    const confirmCancel = async () => {
        if (!bookingToCancel) return;

        setProcessing(bookingToCancel);
        setShowModal(false);

        try {
            const res = await fetch(`https://titan-strength.me/api/v1/classes/${bookingToCancel}/cancel`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Booking cancelled successfully");
                fetchBookings();
            } else {
                toast.error(data.message || "Could not cancel");
            }
        } catch (err) {
            toast.error("Error cancelling booking");
        } finally {
            setProcessing(null);
            setBookingToCancel(null);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setBookingToCancel(null);
    };

    if (loading) return <div className="loading-container">Loading Schedule...</div>;

    return (
        <section className="dashboard-section">
            <div className="section-header-flex">
                <h2>My Booked Classes</h2>
            </div>

            <div className="cards-grid">
                {bookings.length > 0 ? bookings.map(b => (
                    <div key={b._id} className="dashboard-card class-card">
                        <div className="class-header">
                            <h3 className="class-title">{b.classSession?.title}</h3>
                            <span className="status-badge booked">Booked</span>
                        </div>
                        <div className="class-info">
                            <div className="info-row">
                                <span>📅</span>
                                <span>{new Date(b.classSession?.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div className="info-row">
                                <span>⏰</span>
                                <span>{new Date(b.classSession?.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="info-row">
                                <span>💪</span>
                                <span>{b.classSession?.trainer?.name || 'Titan Trainer'}</span>
                            </div>
                        </div>
                        <button
                            className="btn-cancel-outline"
                            disabled={processing === b.classSession?._id}
                            onClick={() => initiateCancel(b.classSession?._id)}
                        >
                            {processing === b.classSession?._id ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                    </div>
                )) : (
                    <div className="empty-state">
                        <p>No upcoming classes booked.</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">Cancel Booking?</h3>
                        <p className="modal-text">
                            Are you sure you want to cancel this class? This action cannot be undone.
                        </p>
                        <div className="modal-actions">
                            <button className="btn-modal-secondary" onClick={closeModal}>
                                No, Keep it
                            </button>
                            <button className="btn-modal-danger" onClick={confirmCancel}>
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MemberClasses;