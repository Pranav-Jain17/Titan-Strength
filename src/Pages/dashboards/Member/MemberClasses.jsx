import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MemberClasses = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('titanUser');
        return storedUser ? JSON.parse(storedUser).token : null;
    };

    useEffect(() => {
        const fetchBookings = async () => {
            const token = getAuthToken();
            try {
                const response = await fetch('https://titan-strength.me/api/v1/members/my-bookings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setBookings(data.data);
                }
            } catch (error) {
                toast.error("Failed to load bookings");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    return (
        <section className="dashboard-section fade-in">
            <div className="section-header-flex">
                <h2>My Class Schedule</h2>
            </div>

            {loading ? <p className="loading-text">Loading schedule...</p> : (
                <div className="cards-grid">
                    {bookings.map(b => (
                        <div key={b._id} className="dashboard-card class-card">
                            <div className="card-header">
                                <h3>{b.classSession?.title}</h3>
                                <span className="status-badge active">Booked</span>
                            </div>
                            <div className="card-body">
                                <p><strong>Trainer:</strong> {b.classSession?.trainer?.name || 'Staff'}</p>
                                <p><strong>Date:</strong> {new Date(b.classSession?.startTime).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> {new Date(b.classSession?.startTime).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    ))}
                    {bookings.length === 0 && <p className="no-data">No upcoming classes booked.</p>}
                </div>
            )}
        </section>
    );
};

export default MemberClasses;