import { useState } from 'react';
import './memberDashboard.css';
import MemberHome from './MemberHome.jsx';
import MemberActivity from './MemberActivity.jsx';
import MemberClasses from './MemberClasses.jsx';
import MemberSchedule from './MemberSchedule.jsx';
import MemberContent from './MemberContent.jsx';
import MemberBilling from './MemberBilling.jsx';

const MemberDashboard = () => {
    const [activeTab, setActiveTab] = useState('home');

    const renderContent = () => {
        switch (activeTab) {
            case 'home': return <MemberHome />;
            case 'schedule': return <MemberSchedule />;
            case 'my-classes': return <MemberClasses />;
            case 'content': return <MemberContent />;
            case 'activity': return <MemberActivity />;
            case 'billing': return <MemberBilling />;
            default: return <MemberHome />;
        }
    };

    return (
        <div className="member-wrapper">
            <nav className="member-nav">
                <ul>
                    <li className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>Home</li>
                    <li className={activeTab === 'schedule' ? 'active' : ''} onClick={() => setActiveTab('schedule')}>Book Class</li>
                    <li className={activeTab === 'my-classes' ? 'active' : ''} onClick={() => setActiveTab('my-classes')}>My Bookings</li>
                    <li className={activeTab === 'content' ? 'active' : ''} onClick={() => setActiveTab('content')}>Content</li>
                    <li className={activeTab === 'activity' ? 'active' : ''} onClick={() => setActiveTab('activity')}>History</li>
                    <li className={activeTab === 'billing' ? 'active' : ''} onClick={() => setActiveTab('billing')}>Billing</li>
                </ul>
            </nav>
            <main className="member-content">
                {renderContent()}
            </main>
        </div>
    );
};

export default MemberDashboard;