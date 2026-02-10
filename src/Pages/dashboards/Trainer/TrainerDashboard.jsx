import { useState, useEffect } from 'react';
import './trainerDashboard.css';
import TrainerOverview from './TrainerOverview.jsx';
import TrainerSchedule from './TrainerSchedule.jsx';
import TrainerContent from './TrainerContent.jsx';
import TrainerClientDetail from './TrainerClientDetail.jsx';
import TrainerClasses from './TrainerClasses.jsx';

const TrainerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('titanUser'))?.token;
                const headers = { Authorization: `Bearer ${token}` };

                const res = await fetch('https://titan-strength.me/api/v1/content/videos', { headers });
                const data = await res.json();

                if (data.success) setVideos(data.data);

            } catch (error) {
                console.error("Failed to load video options:", error);
            }
        };

        fetchVideos();
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <TrainerOverview />;
            case 'schedule': return <TrainerSchedule />;
            case 'classes': return <TrainerClasses />;
            case 'clientDetail':
                return <TrainerClientDetail videos={videos} />;
            case 'content': return <TrainerContent />;
            default: return <TrainerOverview />;
        }
    };

    return (
        <div className="trainer-wrapper">
            <nav className="trainer-nav">
                <ul>
                    <li className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</li>
                    <li className={activeTab === 'schedule' ? 'active' : ''} onClick={() => setActiveTab('schedule')}>Schedule</li>
                    <li className={activeTab === 'classes' ? 'active' : ''} onClick={() => setActiveTab('classes')}>Classes</li>
                    <li className={activeTab === 'clientDetail' ? 'active' : ''} onClick={() => setActiveTab('clientDetail')}>Client Detail</li>
                    <li className={activeTab === 'content' ? 'active' : ''} onClick={() => setActiveTab('content')}>Content</li>
                </ul>
            </nav>
            <main className="trainer-content">
                {renderContent()}
            </main>
        </div>
    );
};

export default TrainerDashboard;