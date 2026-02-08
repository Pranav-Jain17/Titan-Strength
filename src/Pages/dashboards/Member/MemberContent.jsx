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
                <h2>Resource Library</h2>
                <div className="toggle-group">
                    <button
                        className={`btn-toggle ${activeTab === 'videos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('videos')}
                    >Workout Videos</button>
                    <button
                        className={`btn-toggle ${activeTab === 'diets' ? 'active' : ''}`}
                        onClick={() => setActiveTab('diets')}
                    >Diet Templates</button>
                </div>
            </div>

            {loading ? <div className="loading-container"><div className="spinner"></div></div> : (
                <div className="cards-grid">
                    {items.length > 0 ? items.map((item, idx) => (
                        <div key={item._id || idx} className="dashboard-card">
                            {activeTab === 'videos' ? (
                                <>
                                    <div className="video-placeholder">
                                        {item.url ? (
                                            <video src={item.url} controls className="video-thumbnail" preload="metadata" />
                                        ) : (
                                            <span>▶️</span>
                                        )}
                                    </div>
                                    <div className="card-body">
                                        <h3 className="class-title">{item.title}</h3>
                                        <p className="content-desc">{item.description}</p>
                                        <div className="tag-container">
                                            {item.tags?.map(tag => <span key={tag} className="video-tag">#{tag}</span>)}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="card-body">
                                    <div className="card-header-flex">
                                        <h3 className="text-highlight">{item.name}</h3>
                                        <span className="status-badge active">{item.goalType}</span>
                                    </div>
                                    <p className="content-desc">{item.description}</p>
                                    <div className="diet-meta">
                                        {item.calories && <span className="video-tag">🔥 {item.calories} cal</span>}
                                        {item.protein && <span className="video-tag">🥩 {item.protein}g protein</span>}
                                    </div>
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="empty-state">No {activeTab} found in library.</div>
                    )}
                </div>
            )}
        </section>
    );
};

export default MemberContent;