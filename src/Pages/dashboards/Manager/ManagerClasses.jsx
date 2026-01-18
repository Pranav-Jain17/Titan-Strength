import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Classes = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list');
    const [selectedClass, setSelectedClass] = useState(null);
    const [attendanceList, setAttendanceList] = useState([]);

    const [formData, setFormData] = useState({
        title: '', description: '', startTime: '', duration: 60, trainerId: '', capacity: 20
    });

    const getToken = () => JSON.parse(localStorage.getItem('titanUser'))?.token;

    const fetchSchedule = async () => {
        try {
            const res = await fetch('https://titan-strength.me/api/v1/classes/schedule');
            const data = await res.json();
            if (data.success) setSchedule(data.data);
        } catch (err) {
            toast.error("Failed to load schedule");
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendance = async (classId) => {
        const token = getToken();
        try {
            const res = await fetch(`https://titan-strength.me/api/v1/classes/attendance/${classId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setAttendanceList(data.data);
        } catch (err) {
            toast.error("Failed to load attendance");
        }
    };

    useEffect(() => { fetchSchedule(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        const token = getToken();
        const start = new Date(formData.startTime);
        const end = new Date(start.getTime() + formData.duration * 60000);

        try {
            const res = await fetch('https://titan-strength.me/api/v1/classes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    endTime: end.toISOString()
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Class scheduled successfully");
                fetchSchedule();
                setView('list');
            } else {
                toast.error(data.message || "Failed to create class");
            }
        } catch (err) {
            toast.error("Server error");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = getToken();
        try {
            const res = await fetch(`https://titan-strength.me/api/v1/classes/${selectedClass.classId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: selectedClass.title,
                    status: selectedClass.status
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Class updated");
                fetchSchedule();
            }
        } catch (err) {
            toast.error("Update failed");
        }
    };

    const markAttendance = async (userId, status) => {
        const token = getToken();
        try {
            const res = await fetch('https://titan-strength.me/api/v1/classes/attendance/mark', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    classId: selectedClass.classId,
                    userId,
                    status
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Marked as ${status}`);
                fetchAttendance(selectedClass.classId);
            }
        } catch (err) {
            toast.error("Failed to mark attendance");
        }
    };

    const openDetails = (cls) => {
        setSelectedClass(cls);
        fetchAttendance(cls.classId);
        setView('details');
    };

    return (
        <section className="dashboard-section fade-in">
            <div className="section-header-flex">
                <h2>Class Management</h2>
                {view === 'list' && (
                    <button onClick={() => setView('create')} className="btn-create">
                        + Schedule Class
                    </button>
                )}
                {view !== 'list' && (
                    <button onClick={() => setView('list')} className="btn-back">
                        ← Back to Schedule
                    </button>
                )}
            </div>

            {view === 'list' && (
                <div className="table-container">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Date & Time</th>
                                <th>Trainer</th>
                                <th>Occupancy</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? <tr><td colSpan="6" className="text-center">Loading...</td></tr> :
                                schedule.map(s => (
                                    <tr key={s.classId}>
                                        <td>{s.title}</td>
                                        <td>
                                            {new Date(s.startTime).toLocaleDateString()} <br />
                                            <small className="text-muted">{new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                                        </td>
                                        <td>{s.trainer?.name || 'Unassigned'}</td>
                                        <td>{s.reserved} / {s.capacity}</td>
                                        <td><span className={`status-badge ${s.status === 'scheduled' ? 'active' : 'expired'}`}>{s.status}</span></td>
                                        <td>
                                            <button onClick={() => openDetails(s)} className="btn-manage">
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}

            {view === 'create' && (
                <div className="dashboard-card form-card">
                    <h3>Schedule New Class</h3>
                    <form onSubmit={handleCreate} className="form-vertical">
                        <div>
                            <label className="form-label">Class Title</label>
                            <input type="text" className="form-input" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. HIIT Morning" />
                        </div>
                        <div>
                            <label className="form-label">Start Time</label>
                            <input type="datetime-local" className="form-input" required value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} />
                        </div>
                        <div className="form-row">
                            <div className="form-col">
                                <label className="form-label">Duration (mins)</label>
                                <input type="number" className="form-input" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                            </div>
                            <div className="form-col">
                                <label className="form-label">Capacity</label>
                                <input type="number" className="form-input" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} />
                            </div>
                        </div>
                        <button type="submit" className="btn-submit">Create Schedule</button>
                    </form>
                </div>
            )}

            {view === 'details' && selectedClass && (
                <div className="cards-grid">
                    <div className="dashboard-card">
                        <h3>Edit Details</h3>
                        <form onSubmit={handleUpdate} className="form-vertical">
                            <div>
                                <label className="form-label">Title</label>
                                <input type="text" className="form-input" value={selectedClass.title} onChange={e => setSelectedClass({ ...selectedClass, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="form-label">Status</label>
                                <select className="form-input" value={selectedClass.status} onChange={e => setSelectedClass({ ...selectedClass, status: e.target.value })}>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <button type="submit" className="btn-save">Save Changes</button>
                        </form>
                    </div>

                    <div className="dashboard-card span-2">
                        <h3>Attendance Roster</h3>
                        <div className="table-container roster-container">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Member</th>
                                        <th>Current Status</th>
                                        <th>Mark As</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceList.length === 0 ? (
                                        <tr><td colSpan="3" className="text-center">No bookings yet</td></tr>
                                    ) : (
                                        attendanceList.map(record => (
                                            <tr key={record._id}>
                                                <td>
                                                    {record.user?.name} <br />
                                                    <small className="text-muted">{record.user?.email}</small>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${record.status}`}>{record.status}</span>
                                                </td>
                                                <td className="action-buttons">
                                                    <button onClick={() => markAttendance(record.user._id, 'present')} className="btn-present">Present</button>
                                                    <button onClick={() => markAttendance(record.user._id, 'absent')} className="btn-absent">Absent</button>
                                                </td>
                                            </tr>
                                        ))
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

export default Classes;