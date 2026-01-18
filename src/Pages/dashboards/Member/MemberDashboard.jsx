import { useState } from 'react';
import './memberDashboard.css';
import MemberHome from './MemberHome.jsx';
import MemberActivity from './MemberActivity.jsx';
import MemberClasses from './MemberClasses.jsx';
import MemberBilling from './MemberBilling.jsx';

const MemberDashboard = () => {
    const [activeTab, setActiveTab] = useState('home');

    const renderContent = () => {
        switch (activeTab) {
            case 'home': return <MemberHome />;
            case 'activity': return <MemberActivity />;
            case 'classes': return <MemberClasses />;
            case 'billing': return <MemberBilling />;
            default: return <MemberHome />;
        }
    };

    return (
        <div className="member-wrapper">
            <nav className="member-nav">
                <ul>
                    <li className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>Home</li>
                    <li className={activeTab === 'activity' ? 'active' : ''} onClick={() => setActiveTab('activity')}>Activity</li>
                    <li className={activeTab === 'classes' ? 'active' : ''} onClick={() => setActiveTab('classes')}>Classes</li>
                    <li className={activeTab === 'billing' ? 'active' : ''} onClick={() => setActiveTab('billing')}>Billing</li>
                </ul>
            </nav>
            <div className="member-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default MemberDashboard;