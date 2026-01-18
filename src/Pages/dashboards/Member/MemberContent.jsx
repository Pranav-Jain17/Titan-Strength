import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MemberContent = () => {
    const [activeTab, setActiveTab] = useState('videos');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const getToken = () => JSON.parse(localStorage.getItem('titanUser'))?.token;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const token = getToken();
            const endpoint = activeTab === 'videos'
                ? 'https://titan-strength.me/api/v1/content/videos'
                : 'https://titan-strength.me/api/v1/content/diets';

            try {
                const res = await fetch(endpoint, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) setItems(data.data);
            } catch (err) {
                toast.error(`Failed to load ${activeTab}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeTab]);

    return (
        <section className="dashboard-section">
            <div className="section-header-flex">
                <h2>Member Resources</h2>
                <div className="toggle-group">
                    <button
                        className={`btn-toggle ${activeTab === 'videos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('videos')}
                    >Workout Videos</button>
                    <button
                        className={`btn-toggle ${activeTab === 'diets' ? 'active' : ''}`}
                        onClick={() => setActiveTab('diets')}
                    >Diet Plans</button>
                </div>
            </div>

            {loading ? <div className="loading-container">Loading Content...</div> : (
                <div className="cards-grid">
                    {items.length > 0 ? items.map((item, idx) => (
                        <div key={item._id || idx} className="dashboard-card">
                            {activeTab === 'videos' ? (
                                <>
                                    <div className="video-placeholder">
                                        <span>▶️</span>
                                    </div>
                                    <h3 className="class-title">{item.title}</h3>
                                    <p className="content-desc">{item.description}</p>
                                    <span className="video-meta">
                                        {item.category || 'General'} • {item.duration ? `${item.duration} mins` : 'Video'}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-highlight">{item.name}</h3>
                                    <span className="status-badge active">{item.goalType}</span>
                                    <p className="content-desc">{item.description}</p>
                                    <div className="diet-includes">
                                        <strong>Includes:</strong>
                                        <p className="text-note">Daily macro breakdown & meal suggestions</p>
                                    </div>
                                </>
                            )}
                        </div>
                    )) : (
                        <div className="empty-state">No {activeTab} available yet.</div>
                    )}
                </div>
            )}
        </section>
    );
};

export default MemberContent;