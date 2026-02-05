import { useState } from 'react';
import './ownerDashboard.css';
import OwnerStatsRevenue from './OwnerStatsRevenue.jsx';
import OwnerBranches from './OwnerBranches.jsx';
import OwnerPlans from './OwnerPlans.jsx';
import OwnerUserManagement from './OwnerUserManagement.jsx';
import OwnerSubscriptions from './OwnerSubscriptions.jsx';
import OwnerManagers from './OwnerManagers.jsx';

const OwnerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OwnerStatsRevenue />;
            case 'branches':
                return <OwnerBranches />;
            case 'managers':
                return <OwnerManagers />;
            case 'plans':
                return <OwnerPlans />;
            case 'users':
                return <OwnerUserManagement />;
            case 'subscriptions':
                return <OwnerSubscriptions />;

            default:
                return <OwnerStatsRevenue />;
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
                        className={activeTab === 'managers' ? 'active-tab' : ''}
                        onClick={() => setActiveTab('managers')}
                    >
                        Managers
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
                    <li
                        className={activeTab === 'subscriptions' ? 'active-tab' : ''}
                        onClick={() => setActiveTab('subscriptions')}
                    >
                        Subscriptions
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