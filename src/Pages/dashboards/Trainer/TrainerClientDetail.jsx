import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const TrainerClientDetail = ({ clientId, onBack }) => {
    const [client, setClient] = useState(null);
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('progress');
    const [showProgressModal, setShowProgressModal] = useState(false);

    // Forms
    const [progressForm, setProgressForm] = useState({ weight: '', bodyFatPercent: '', bicepSize: '', notes: '' });
    const [dietForm, setDietForm] = useState({ dietId: '', customPlan: '', notes: '' });
    const [workoutForm, setWorkoutForm] = useState({ videoId: '', customPlan: '', notes: '' });

    // Available Options
    const [diets, setDiets] = useState([]);
    const [videos, setVideos] = useState([]);

    const getToken = () => JSON.parse(localStorage.getItem('titanUser'))?.token;

    useEffect(() => {
        const fetchAll = async () => {
            const token = getToken();
            try {
                const [profileRes, progressRes, dietsRes, videosRes] = await Promise.all([
                    fetch(`https://titan-strength.me/api/v1/trainers/clients/${clientId}`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`https://titan-strength.me/api/v1/trainers/clients/${clientId}/progress`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`https://titan-strength.me/api/v1/content/diets`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`https://titan-strength.me/api/v1/content/videos`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                const pData = await profileRes.json();
                const progData = await progressRes.json();
                const dData = await dietsRes.json();
                const vData = await videosRes.json();

                if (pData.success) setClient(pData.data);
                if (progData.success) setProgress(progData.data);
                if (dData.success) setDiets(dData.data);
                if (vData.success) setVideos(vData.data);

            } catch (err) {
                toast.error("Error loading client data");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [clientId]);

    const handleAddProgress = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`https://titan-strength.me/api/v1/trainers/clients/${clientId}/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(progressForm)
            });
            const result = await res.json();
            if (result.success) {
                toast.success("Progress logged");
                setProgress([result.data, ...progress]);
                setShowProgressModal(false);
                setProgressForm({ weight: '', bodyFatPercent: '', bicepSize: '', notes: '' });
            }
        } catch (err) {
            toast.error("Failed to log progress");
        }
    };

    const handleAssignDiet = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`https://titan-strength.me/api/v1/trainers/clients/${clientId}/assign-diet`, {
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
        try {
            const res = await fetch(`https://titan-strength.me/api/v1/trainers/clients/${clientId}/assign-workout`, {
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

    if (loading) return <div className="loading-container">Loading Profile...</div>;

    return (
        <section className="dashboard-section">
            <div style={{ marginBottom: '1rem' }}>
                <button onClick={onBack} className="btn-secondary">← Back to Roster</button>
            </div>

            <div className="dashboard-card client-header">
                <div className="client-avatar">{client?.name?.charAt(0)}</div>
                <div className="client-info">
                    <h2>{client?.name}</h2>
                    <div className="client-meta">
                        <span>📧 {client?.email}</span>
                        <span>🎯 {client?.goal}</span>
                        <span>⚖️ {client?.currentWeight || '--'} kg</span>
                        <span>🏢 {client?.homeBranch?.name || 'Main Branch'}</span>
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
                                {progress.length > 0 ? progress.map(p => (
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
                                <label className="form-label">Select Plan</label>
                                <select className="form-select" value={dietForm.dietId} onChange={e => setDietForm({ ...dietForm, dietId: e.target.value })}>
                                    <option value="">-- Choose Standard Plan --</option>
                                    {diets.map(d => <option key={d._id} value={d._id}>{d.name} ({d.goalType})</option>)}
                                </select>
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