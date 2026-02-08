import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

const TrainerClientDetail = ({ videos = [] }) => {
    const [viewMode, setViewMode] = useState('list');
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    const [clientProfile, setClientProfile] = useState(null);
    const [clientProgress, setClientProgress] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [activeTab, setActiveTab] = useState('progress');
    const [showProgressModal, setShowProgressModal] = useState(false);

    const [progressForm, setProgressForm] = useState({ weight: '', bodyFatPercent: '', bicepSize: '', notes: '' });
    const [dietForm, setDietForm] = useState({ dietId: '', customPlan: '', notes: '' });
    const [workoutForm, setWorkoutForm] = useState({ videoId: '', customPlan: '', notes: '' });

    const getToken = () => JSON.parse(localStorage.getItem('titanUser'))?.token;

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await fetch('https://titan-strength.me/api/v1/trainers/clients', {
                    headers: { Authorization: `Bearer ${getToken()}` }
                });
                const result = await res.json();

                if (result.success) {
                    setClients(result.data);
                }
            } catch (err) {
                toast.error("Failed to load client roster");
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    const handleSelectClient = useCallback(async (clientId) => {
        setLoadingProfile(true);
        setSelectedClientId(clientId);
        setViewMode('detail');
        const token = getToken();

        try {
            const [profileRes, progressRes] = await Promise.all([
                fetch(`https://titan-strength.me/api/v1/trainers/clients/${clientId}`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`https://titan-strength.me/api/v1/trainers/clients/${clientId}/progress`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            const pData = await profileRes.json();
            const progData = await progressRes.json();

            if (pData.success) setClientProfile(pData.data);
            if (progData.success) setClientProgress(progData.data);
        } catch (err) {
            toast.error("Error loading client profile");
            setViewMode('list');
        } finally {
            setLoadingProfile(false);
        }
    }, []);

    const handleBackToList = () => {
        setSelectedClientId(null);
        setClientProfile(null);
        setClientProgress([]);
        setViewMode('list');
    };

    const handleAddProgress = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`https://titan-strength.me/api/v1/trainers/clients/${selectedClientId}/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(progressForm)
            });
            const result = await res.json();
            if (result.success) {
                toast.success("Progress logged");
                setClientProgress([result.data, ...clientProgress]);
                setShowProgressModal(false);
                setProgressForm({ weight: '', bodyFatPercent: '', bicepSize: '', notes: '' });
            }
        } catch (err) {
            toast.error("Failed to log progress");
        }
    };

    const handleAssignDiet = async (e) => {
        e.preventDefault();

        if (!dietForm.dietId && !dietForm.customPlan) {
            toast.warn("Please enter a Diet ID or a Custom Plan");
            return;
        }

        try {
            const res = await fetch(`https://titan-strength.me/api/v1/trainers/clients/${selectedClientId}/assign-diet`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(dietForm)
            });
            if (res.ok) toast.success("Diet assigned successfully");
            else toast.error("Assignment failed");
        } catch (err) {
            toast.error("Server error");
        }
    };

    const handleAssignWorkout = async (e) => {
        e.preventDefault();

        if (!workoutForm.videoId && !workoutForm.customPlan) {
            toast.warn("Please select a Video or enter a Custom Routine");
            return;
        }

        try {
            const res = await fetch(`https://titan-strength.me/api/v1/trainers/clients/${selectedClientId}/assign-workout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(workoutForm)
            });
            if (res.ok) toast.success("Workout assigned successfully");
            else toast.error("Assignment failed");
        } catch (err) {
            toast.error("Server error");
        }
    };

    if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading Roster...</p></div>;

    if (viewMode === 'list') {
        return (
            <section className="dashboard-section">
                <div className="section-header-flex">
                    <h2>Assigned Clients</h2>
                </div>
                <div className="table-container">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Goal</th>
                                <th>Branch</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.length > 0 ? clients.map(c => (
                                <tr key={c.assignmentId}>
                                    <td>
                                        <strong>{c.member?.name}</strong><br />
                                        <small style={{ color: '#888' }}>{c.member?.email}</small>
                                    </td>
                                    <td>{c.member?.goal || 'N/A'}</td>
                                    <td>{c.member?.homeBranch?.name || 'Main'}</td>
                                    <td><span className={`status-badge ${c.active ? 'active' : 'inactive'}`}>{c.active ? 'Active' : 'Inactive'}</span></td>
                                    <td>
                                        <button className="btn-primary" onClick={() => handleSelectClient(c.member._id)}>
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No clients assigned</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        );
    }

    if (loadingProfile) return <div className="loading-container"><div className="spinner"></div><p>Loading Profile...</p></div>;

    return (
        <section className="dashboard-section">
            <div style={{ marginBottom: '1rem' }}>
                <button onClick={handleBackToList} className="btn-secondary">← Back to Roster</button>
            </div>

            <div className="dashboard-card client-header">
                <div className="client-avatar">{clientProfile?.name?.charAt(0)}</div>
                <div className="client-info">
                    <h2>{clientProfile?.name}</h2>
                    <div className="client-meta">
                        <span> Email: {clientProfile?.email}</span>
                        <span> Goal: {clientProfile?.goal}</span>
                        <span> Weight: {clientProfile?.currentWeight || '--'} kg</span>
                        <span> Branch: {clientProfile?.homeBranch?.name || 'Main Branch'}</span>
                    </div>
                </div>
            </div>

            <div className="tabs-container">
                <button className={`tab-btn ${activeTab === 'progress' ? 'active' : ''}`} onClick={() => setActiveTab('progress')}>Progress History</button>
                <button className={`tab-btn ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => setActiveTab('assignments')}>Assignments</button>
            </div>

            {activeTab === 'progress' && (
                <div>
                    <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
                        <button className="btn-primary" onClick={() => setShowProgressModal(true)}>+ Log Check-in</button>
                    </div>
                    <div className="table-container">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Weight (kg)</th>
                                    <th>Body Fat %</th>
                                    <th>Bicep (cm)</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientProgress.length > 0 ? clientProgress.map(p => (
                                    <tr key={p._id}>
                                        <td>{new Date(p.date).toLocaleDateString()}</td>
                                        <td>{p.weight || '-'}</td>
                                        <td>{p.bodyFatPercent || '-'}%</td>
                                        <td>{p.bicepSize || '-'}</td>
                                        <td style={{ color: '#888', fontStyle: 'italic' }}>{p.notes}</td>
                                    </tr>
                                )) : <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No logs yet</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'assignments' && (
                <div className="cards-grid">
                    <div className="dashboard-card">
                        <h3>Assign Nutrition</h3>
                        <form onSubmit={handleAssignDiet}>
                            <div className="form-group">
                                <label className="form-label">Diet Plan ID</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter Diet ID"
                                    value={dietForm.dietId}
                                    onChange={e => setDietForm({ ...dietForm, dietId: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Or Custom Plan</label>
                                <textarea className="form-textarea" rows="3" placeholder="Enter custom diet details..." value={dietForm.customPlan} onChange={e => setDietForm({ ...dietForm, customPlan: e.target.value })}></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Notes</label>
                                <input type="text" className="form-input" value={dietForm.notes} onChange={e => setDietForm({ ...dietForm, notes: e.target.value })} />
                            </div>
                            <button className="btn-primary">Assign Diet</button>
                        </form>
                    </div>

                    <div className="dashboard-card">
                        <h3>Assign Workout</h3>
                        <form onSubmit={handleAssignWorkout}>
                            <div className="form-group">
                                <label className="form-label">Select Video</label>
                                <select className="form-select" value={workoutForm.videoId} onChange={e => setWorkoutForm({ ...workoutForm, videoId: e.target.value })}>
                                    <option value="">-- Choose Workout Video --</option>
                                    {videos.map(v => <option key={v._id} value={v._id}>{v.title}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Or Custom Routine</label>
                                <textarea className="form-textarea" rows="3" placeholder="Enter custom workout details..." value={workoutForm.customPlan} onChange={e => setWorkoutForm({ ...workoutForm, customPlan: e.target.value })}></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Notes</label>
                                <input type="text" className="form-input" value={workoutForm.notes} onChange={e => setWorkoutForm({ ...workoutForm, notes: e.target.value })} />
                            </div>
                            <button className="btn-primary">Assign Workout</button>
                        </form>
                    </div>
                </div>
            )}

            {showProgressModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Log Progress</h3>
                            <button className="btn-close" onClick={() => setShowProgressModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleAddProgress}>
                            <div className="form-group">
                                <label className="form-label">Weight (kg)</label>
                                <input type="number" className="form-input" value={progressForm.weight} onChange={e => setProgressForm({ ...progressForm, weight: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Body Fat %</label>
                                <input type="number" className="form-input" value={progressForm.bodyFatPercent} onChange={e => setProgressForm({ ...progressForm, bodyFatPercent: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Bicep Size (cm)</label>
                                <input type="number" className="form-input" value={progressForm.bicepSize} onChange={e => setProgressForm({ ...progressForm, bicepSize: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Notes</label>
                                <input type="text" className="form-input" value={progressForm.notes} onChange={e => setProgressForm({ ...progressForm, notes: e.target.value })} />
                            </div>
                            <button className="btn-primary" style={{ width: '100%' }}>Save Log</button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default TrainerClientDetail;