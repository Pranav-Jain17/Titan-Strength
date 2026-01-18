import { useState } from 'react';
import './managerDashboard.css';
import ManagerOverview from './ManagerOverview.jsx';
import ManagerDailyOps from './ManagerDailyOps.jsx';
import ManagerMembers from './ManagerMembers.jsx';
import ManagerFacility from './ManagerFacility.jsx';
import ManagerStaff from './ManagerStaff.jsx';
import ManagerClasses from './ManagerClasses.jsx';

const ManagerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <ManagerOverview />;
            case 'classes': return <ManagerClasses />;
            case 'dailyops': return <ManagerDailyOps />;
            case 'members': return <ManagerMembers />;
            case 'facility': return <ManagerFacility />;
            case 'staff': return <ManagerStaff />;
            default: return <ManagerOverview />;
        }
    };

    return (
        <div className="manager-wrapper">
            <nav className="manager-nav">
                <ul>
                    <li className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</li>
                    <li className={activeTab === 'classes' ? 'active' : ''} onClick={() => setActiveTab('classes')}>Classes</li>
                    <li className={activeTab === 'dailyops' ? 'active' : ''} onClick={() => setActiveTab('dailyops')}>Daily Ops</li>
                    <li className={activeTab === 'members' ? 'active' : ''} onClick={() => setActiveTab('members')}>Members</li>
                    <li className={activeTab === 'facility' ? 'active' : ''} onClick={() => setActiveTab('facility')}>Facility</li>
                    <li className={activeTab === 'staff' ? 'active' : ''} onClick={() => setActiveTab('staff')}>Staff</li>
                </ul>
            </nav>
            <div className="manager-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default ManagerDashboard;