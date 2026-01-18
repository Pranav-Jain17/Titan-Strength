import { useState } from 'react';
import './managerDashboard.css';
import Overview from './ManagerOverview.jsx';
import DailyOps from './ManagerDailyOps.jsx';
import Members from './ManagerMembers.jsx';
import Facility from './ManagerFacility.jsx';
import Staff from './ManagerStaff.jsx';
import Classes from './ManagerClasses.jsx';

const ManagerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <Overview />;
            case 'classes': return <Classes />;
            case 'dailyops': return <DailyOps />;
            case 'members': return <Members />;
            case 'facility': return <Facility />;
            case 'staff': return <Staff />;
            default: return <Overview />;
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