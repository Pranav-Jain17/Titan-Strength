import { useState } from 'react';
import './trainerDashboard.css';
import TrainerOverview from './TrainerOverview.jsx';
import TrainerSchedule from './TrainerSchedule.jsx';
import TrainerClients from './TrainerClients.jsx';

const TrainerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <TrainerOverview />;
            case 'schedule': return <TrainerSchedule />;
            case 'clients': return <TrainerClients />;
            default: return <TrainerOverview />;
        }
    };

    return (
        <div className="trainer-wrapper">
            <nav className="trainer-nav">
                <ul>
                    <li className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</li>
                    <li className={activeTab === 'schedule' ? 'active' : ''} onClick={() => setActiveTab('schedule')}>Schedule</li>
                    <li className={activeTab === 'clients' ? 'active' : ''} onClick={() => setActiveTab('clients')}>Clients</li>
                </ul>
            </nav>
            <main className="trainer-content">
                {renderContent()}
            </main>
        </div>
    );
};

export default TrainerDashboard;