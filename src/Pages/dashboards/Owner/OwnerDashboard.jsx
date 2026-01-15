import { useState } from 'react';
import './ownerDashboard.css';
import StatsRevenue from './StatsRevenue.jsx';
import Branches from './Branches.jsx';
import Plans from './Plans.jsx';
import UserManagement from './UserManagement.jsx';

const OwnerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <StatsRevenue />;
            case 'branches':
                return <Branches />;
            case 'plans':
                return <Plans />;
            case 'users':
                return <UserManagement />;
            default:
                return <StatsRevenue />;
        }
    };

    return (
        <div className="dashboard-wrapper">
            <nav className="dashboard-subnav">
                <ul>
                    <li
                        className={activeTab === 'overview' ? 'active-tab' : ''}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </li>
                    <li
                        className={activeTab === 'branches' ? 'active-tab' : ''}
                        onClick={() => setActiveTab('branches')}
                    >
                        Branches
                    </li>
                    <li
                        className={activeTab === 'plans' ? 'active-tab' : ''}
                        onClick={() => setActiveTab('plans')}
                    >
                        Plans
                    </li>
                    <li
                        className={activeTab === 'users' ? 'active-tab' : ''}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </li>
                </ul>
            </nav>

            <div className="dashboard-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default OwnerDashboard;