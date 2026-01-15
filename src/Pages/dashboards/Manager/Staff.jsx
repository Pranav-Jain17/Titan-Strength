import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Staff = () => {
    const [trainers, setTrainers] = useState([]);
    const [trainerForm, setTrainerForm] = useState({ name: '', email: '', password: '', branchId: '' });
    const [assignForm, setAssignForm] = useState({ trainerId: '', memberId: '', notes: '' });
    const [branchAssignForm, setBranchAssignForm] = useState({ trainerId: '', branchId: '' });

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('titanUser');
        return storedUser ? JSON.parse(storedUser).token : null;
    };

    const fetchTrainers = async () => {
        const token = getAuthToken();
        try {
            const res = await fetch('https://titan-strength.me/api/v1/manager/trainers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setTrainers(data.data);
        } catch (err) {
            toast.error("Failed to load trainers");
        }
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    const handleCreateTrainer = async (e) => {
        e.preventDefault();
        const token = getAuthToken();
        try {
            const res = await fetch('https://titan-strength.me/api/v1/manager/trainers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(trainerForm)
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Trainer Created");
                setTrainerForm({ name: '', email: '', password: '', branchId: '' });
                fetchTrainers();
            } else {
                toast.error(data.message || data.error);
            }
        } catch (err) {
            toast.error("Creation failed");
        }
    };

    const handleAssignClient = async (e) => {
        e.preventDefault();
        const token = getAuthToken();
        try {
            const res = await fetch('https://titan-strength.me/api/v1/manager/trainers/assign-client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(assignForm)
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Client Assigned");
                setAssignForm({ trainerId: '', memberId: '', notes: '' });
            } else {
                toast.error(data.message || data.error);
            }
        } catch (err) {
            toast.error("Assignment failed");
        }
    };

    const handleAssignBranch = async (e) => {
        e.preventDefault();
        const token = getAuthToken();
        try {
            const res = await fetch(`https://titan-strength.me/api/v1/manager/trainers/${branchAssignForm.trainerId}/assign-branch`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ branchId: branchAssignForm.branchId })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Branch Assigned");
                setBranchAssignForm({ trainerId: '', branchId: '' });
                fetchTrainers();
            } else {
                toast.error(data.message || data.error);
            }
        } catch (err) {
            toast.error("Branch assignment failed");
        }
    };

    return (
        <section className="dashboard-section fade-in">
            <div className="table-container" style={{ marginBottom: '40px' }}>
                <h3 className="section-subtitle">Staff List</h3>
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Home Branch ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainers.map(t => (
                            <tr key={t._id}>
                                <td>{t.name}</td>
                                <td>{t.email}</td>
                                <td>{t.role}</td>
                                <td>{t.homeBranch || 'Unassigned'}</td>
                            </tr>
                        ))}
                        {trainers.length === 0 && <tr><td colSpan="4" className="text-center">No trainers found</td></tr>}
                    </tbody>
                </table>
            </div>

            <div className="cards-grid">
                <div className="dashboard-card">
                    <div className="card-header"><h3>Register New Trainer</h3></div>
                    <form onSubmit={handleCreateTrainer}>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" className="form-input" value={trainerForm.name} onChange={e => setTrainerForm({ ...trainerForm, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" className="form-input" value={trainerForm.email} onChange={e => setTrainerForm({ ...trainerForm, email: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-input" value={trainerForm.password} onChange={e => setTrainerForm({ ...trainerForm, password: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Branch ID (Optional)</label>
                            <input type="text" className="form-input" value={trainerForm.branchId} onChange={e => setTrainerForm({ ...trainerForm, branchId: e.target.value })} placeholder="Auto-assigned for Managers" />
                        </div>
                        <button type="submit" className="btn-primary-large full-width form-submit-btn">Create Account</button>
                    </form>
                </div>

                <div className="dashboard-card">
                    <div className="card-header"><h3>Assign Client</h3></div>
                    <form onSubmit={handleAssignClient}>
                        <div className="form-group">
                            <label>Trainer ID</label>
                            <input type="text" className="form-input" value={assignForm.trainerId} onChange={e => setAssignForm({ ...assignForm, trainerId: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Member ID</label>
                            <input type="text" className="form-input" value={assignForm.memberId} onChange={e => setAssignForm({ ...assignForm, memberId: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Notes</label>
                            <textarea className="form-input" rows="2" value={assignForm.notes} onChange={e => setAssignForm({ ...assignForm, notes: e.target.value })} />
                        </div>
                        <button type="submit" className="btn-edit full-width form-submit-btn">Assign Member</button>
                    </form>
                </div>

                <div className="dashboard-card">
                    <div className="card-header"><h3>Move Trainer to Branch</h3></div>
                    <form onSubmit={handleAssignBranch}>
                        <div className="form-group">
                            <label>Trainer ID</label>
                            <input type="text" className="form-input" value={branchAssignForm.trainerId} onChange={e => setBranchAssignForm({ ...branchAssignForm, trainerId: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>New Branch ID</label>
                            <input type="text" className="form-input" value={branchAssignForm.branchId} onChange={e => setBranchAssignForm({ ...branchAssignForm, branchId: e.target.value })} required />
                        </div>
                        <button type="submit" className="btn-primary-large full-width form-submit-btn">Update Branch</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Staff;