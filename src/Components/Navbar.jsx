import { useState, useContext, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext.jsx';
import { toast } from 'react-toastify';
import DashboardModals from './DashboardModals.jsx';
import '../Styles/navbar.css';

const Navbar = () => {
    const { userData, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const dropdownRef = useRef(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        toast.info("Logged out successfully");
        navigate('/login');
    };

    const handleModalOpen = (type) => {
        setActiveModal(type);
        setIsProfileDropdownOpen(false);
        closeMenu();
    };

    const scrollToSection = (id) => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
        closeMenu();
    };

    const renderNavLinks = () => {
        if (!userData) return null;

        const role = userData.role;
        const commonLinks = [
            <NavLink key="home" to="/" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>,
        ];

        if (role === 'owner') {
            return [
                ...commonLinks,
                <NavLink key="dash" to="/owner/dashboard" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
            ];
        } else if (role === 'manager') {
            return [
                ...commonLinks,
                <NavLink key="dash" to="/manager/dashboard" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
            ];
        } else if (role === 'trainer') {
            return [
                ...commonLinks,
                <NavLink key="dash" to="/trainer/dashboard" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
            ];
        } else if (role === 'member') {
            return [
                ...commonLinks,
                <NavLink key="dash" to="/member/dashboard" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
            ];
        } else {
            // Default Role: 'user'
            return [
                ...commonLinks,
                <NavLink key="dash" to="/user/dashboard" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
            ];
        }
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo" onClick={() => navigate('/')}>
                        <img src="/assets/svg/logo.svg" alt="Titan Strength" className="logo-img" />
                        <span className="logo-text">Titan<span className="text-highlight">Strength</span></span>
                    </div>

                    <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        {userData ? (
                            <>
                                {renderNavLinks()}
                                <div className="nav-profile-container" ref={dropdownRef}>
                                    <div className="profile-icon-btn" onClick={toggleProfileDropdown}>
                                        <div className="profile-initial">
                                            {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                    </div>

                                    <div className={`profile-dropdown ${isProfileDropdownOpen ? 'show' : ''}`}>
                                        <div className="dropdown-header">
                                            <p className="dropdown-name">{userData.name}</p>
                                            <p className="dropdown-email">{userData.email}</p>
                                        </div>
                                        <ul className="dropdown-list">
                                            <li onClick={() => handleModalOpen('profile')}>
                                                <svg className="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                                <span>Profile</span>
                                            </li>
                                            <li onClick={() => handleModalOpen('settings')}>
                                                <svg className="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L4.04 9.43c-.11.21-.06.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.11-.22.06-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                                                </svg>
                                                <span>Settings</span>
                                            </li>
                                            <li onClick={handleLogout} className="dropdown-logout">
                                                <svg className="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                                                </svg>
                                                <span>Logout</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <span onClick={() => scrollToSection('home')} className="nav-link cursor-pointer">Home</span>
                                <span onClick={() => scrollToSection('services')} className="nav-link cursor-pointer">Services</span>
                                <span onClick={() => scrollToSection('about')} className="nav-link cursor-pointer">About Us</span>
                                <span onClick={() => scrollToSection('plans')} className="nav-link cursor-pointer">Plans</span>
                                <span onClick={() => scrollToSection('contact')} className="nav-link cursor-pointer">Contact Us</span>
                                <NavLink to="/login" onClick={closeMenu} className="login-btn-nav">Login</NavLink>
                                <NavLink to="/signup" onClick={closeMenu} className="signup-btn-nav">Sign Up</NavLink>
                            </>
                        )}
                    </div>

                    <div className="menu-icon" onClick={toggleMenu}>
                        {isMenuOpen ? (
                            <span className="close-icon">&times;</span>
                        ) : (
                            <span className="hamburger-icon">&#9776;</span>
                        )}
                    </div>
                </div>
            </nav>

            <DashboardModals
                type={activeModal}
                onClose={() => setActiveModal(null)}
                user={userData}
            />
        </>
    );
};

export default Navbar;