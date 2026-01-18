import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MemberSchedule = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingId, setBookingId] = useState(null);

    const getToken = () => JSON.parse(localStorage.getItem('titanUser'))?.token;

    const fetchSchedule = async () => {
        try {
            const res = await fetch('https://titan-strength.me/api/v1/classes/schedule');
            const data = await res.json();
            if (data.success) setClasses(data.data);
        } catch (err) {
            toast.error("Failed to load timetable");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSchedule(); }, []);

    const handleBook = async (classId) => {
        const token = getToken();
        if (!token) return toast.error("Please login to book");

        setBookingId(classId);
        try {
            const res = await fetch(`https://titan-strength.me/api/v1/classes/${classId}/book`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Class booked successfully!");
                fetchSchedule();
            } else {
                toast.error(data.message || "Booking failed");
            }
        } catch (err) {
            toast.error("Server error");
        } finally {
            setBookingId(null);
        }
    };

    if (loading) return <div className="loading-container">Loading Timetable...</div>;

    return (
        <section className="dashboard-section">
            <div className="section-header-flex">
                <h2>Gym Timetable (Next 7 Days)</h2>
            </div>

            <div className="table-container">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Time</th>
                            <th>Trainer</th>
                            <th>Availability</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.length > 0 ? classes.map(s => (
                            <tr key={s.classId}>
                                <td>
                                    <strong>{s.title}</strong>
                                    <div className="content-desc">{s.description?.substring(0, 30)}...</div>
                                </td>
                                <td>
                                    {new Date(s.startTime).toLocaleDateString(undefined, { weekday: 'short' })} <br />
                                    {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td>{s.trainer?.name || 'Staff'}</td>
                                <td>
                                    <span className={`available-text ${s.available > 0 ? 'text-success' : 'text-danger'}`}>
                                        {s.available} / {s.capacity} spots
                                    </span>
                                </td>
                                <td>
                                    {s.available > 0 ? (
                                        <button
                                            className="btn-action"
                                            disabled={bookingId === s.classId}
                                            onClick={() => handleBook(s.classId)}
                                        >
                                            {bookingId === s.classId ? 'Booking...' : 'Book Now'}
                                        </button>
                                    ) : (
                                        <span className="text-full">Full</span>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="table-empty">No classes scheduled this week</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default MemberSchedule;