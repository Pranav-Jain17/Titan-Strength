import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HomeModals from './HomeModals';
import './Styles/home.css';

const Home = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [activeModal, setActiveModal] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('loginToken');
        if (token) {
            setUser({
                id: localStorage.getItem('userId'),
                name: localStorage.getItem('userName'),
                email: localStorage.getItem('userEmail'),
                role: localStorage.getItem('userRole')
            });
        }
    }, []);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('loginToken');
            if (token) {
                await fetch('https://titan-strength.me/api/v1/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            localStorage.clear();
            setUser(null);
            setIsDropdownOpen(false);
            toast.info("Logged out successfully");
            navigate('/login');
        }
    };

    const openModal = (type) => {
        setActiveModal(type);
        setIsDropdownOpen(false);
    };

    const modalActions = {
        create: (val) => console.log("Create meeting:", val),
        join: (val) => console.log("Join meeting:", val)
    };

    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="logo">
                    Titan-Strength
                </div>

                <div className="nav-right">
                    {!user ? (
                        <button className="login-btn" onClick={handleLoginClick}>
                            Login
                        </button>
                    ) : (
                        <div className="profile-container">
                            <img
                                src="/assets/svg/profile.svg"
                                alt="Profile"
                                className="profile-img"
                                onClick={toggleDropdown}
                            />

                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-item" onClick={() => openModal("profile")}>
                                        <img src="/assets/svg/profile.svg" alt="" className="icon-small" /> Profile
                                    </div>
                                    <div className="dropdown-item" onClick={() => openModal("settings")}>
                                        <img src="/assets/svg/settings.svg" alt="" className="icon-small" /> Settings
                                    </div>
                                    <div className="dropdown-item logout" onClick={handleLogout}>
                                        <img src="/assets/svg/logout.svg" alt="" className="icon-small" /> Logout
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            <HomeModals
                type={activeModal}
                onClose={() => setActiveModal(null)}
                user={user || {}}
                actions={modalActions}
            />
        </div>
    );
};

export default Home;