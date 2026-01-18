import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const TrainerSchedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const getToken = () => JSON.parse(localStorage.getItem('titanUser'))?.token;

    const fetchSchedule = async () => {
        try {
            const res = await fetch('https://titan-strength.me/api/v1/trainers/schedule', {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            const result = await res.json();
            if (result.success) setSchedule(result.data);
        } catch (err) {
            toast.error("Failed to load schedule");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSchedule(); }, []);

    const viewAttendees = async (cls) => {
        setSelectedClass(cls);
        setModalOpen(true);
        setAttendees([]);
        try {
            const res = await fetch(`https://titan-strength.me/api/v1/trainers/schedule/${cls._id}/attendees`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            const result = await res.json();
            if (result.success) setAttendees(result.data);
        } catch (err) {
            toast.error("Could not load attendees");
        }
    };

    return (
        <section className="dashboard-section">
            <div className="section-header-flex">
                <h2>My Teaching Schedule</h2>
            </div>

            <div className="table-container">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Class</th>
                            <th>Capacity</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td></tr>
                        ) : schedule.length > 0 ? (
                            schedule.map(cls => (
                                <tr key={cls._id}>
                                    <td>{new Date(cls.startTime).toLocaleDateString()}</td>
                                    <td>{new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>{cls.title}</td>
                                    <td>{cls.capacity}</td>
                                    <td>
                                        <button className="btn-outline" onClick={() => viewAttendees(cls)}>
                                            View Roster
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No upcoming classes</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">{selectedClass?.title} Attendees</h3>
                            <button className="btn-close" onClick={() => setModalOpen(false)}>×</button>
                        </div>
                        <div className="table-container">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendees.length > 0 ? attendees.map(a => (
                                        <tr key={a._id}>
                                            <td>{a.user?.name}</td>
                                            <td>{a.user?.email}</td>
                                            <td><span className={`status-badge ${a.status === 'present' ? 'active' : 'inactive'}`}>{a.status}</span></td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="3" style={{ textAlign: 'center' }}>No attendees registered yet</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default TrainerSchedule;