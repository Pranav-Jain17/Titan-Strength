import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthContext.jsx';

const UpdatePassword = ({ onClose }) => {
    const { backendUrl } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPass, setShowPass] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [isLoading, setIsLoading] = useState(false);

    const toggleShow = (field) => {
        setShowPass(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { currentPassword, newPassword, confirmPassword } = formData;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return toast.error("All fields are required");
        }
        if (newPassword !== confirmPassword) {
            return toast.error("New passwords do not match");
        }
        if (newPassword.length < 8) {
            return toast.error("Password must be at least 8 characters");
        }

        setIsLoading(true);
        try {
            const storedUser = localStorage.getItem('titanUser');
            const token = storedUser ? JSON.parse(storedUser).token : null;

            if (!token) {
                toast.error("Authentication session missing. Please login again.");
                setIsLoading(false);
                return;
            }

            const response = await fetch(`${backendUrl}/api/v1/auth/update-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message || "Password updated successfully");
                if (onClose) onClose();
            } else {
                toast.error(data.error || "Failed to update password");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const renderPasswordInput = (name, placeholder, showKey, autoComplete) => (
        <div className="input-group-modern">
            <label>{placeholder}</label>
            <div className="password-wrapper">
                <input
                    type={showPass[showKey] ? "text" : "password"}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="password-input"
                    disabled={isLoading}
                    autoComplete={autoComplete}
                />
                <button
                    type="button"
                    onClick={() => toggleShow(showKey)}
                    className="password-toggle-btn"
                >
                    <img src={showPass[showKey] ? "/assets/svg/hidePswd.svg" : "/assets/svg/showPswd.svg"} alt="Toggle" width="20" />
                </button>
            </div>
        </div>
    );

    return (
        <form className="settings-list fade-in" onSubmit={handleSubmit}>
            <input type="text" name="username" autoComplete="username" style={{ display: 'none' }} />

            {renderPasswordInput('currentPassword', 'Current Password', 'current', 'current-password')}
            {renderPasswordInput('newPassword', 'New Password', 'new', 'new-password')}
            {renderPasswordInput('confirmPassword', 'Confirm Password', 'confirm', 'new-password')}

            <div className="modal-footer" style={{ marginTop: '20px' }}>
                <button type="submit" className="btn-primary full-width" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Password'}
                </button>
            </div>
        </form>
    );
};

export default UpdatePassword;