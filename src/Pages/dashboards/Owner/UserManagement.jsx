import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('titanUser');
        return storedUser ? JSON.parse(storedUser).token : null;
    };

    const fetchUsers = async (searchQuery = '') => {
        const token = getAuthToken();
        try {
            setLoading(true);
            let url = 'https://titan-strength.me/api/v1/users';

            if (searchQuery) {
                if (searchQuery.includes('@')) {
                    url += `?email=${searchQuery}`;
                } else {
                    url += `?name=${searchQuery}`;
                }
            }

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(search);
    };

    return (
        <section className="dashboard-section fade-in">
            <div className="section-header-flex">
                <h2>User Management</h2>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="btn-primary-small">Search</button>
                </form>
            </div>

            {loading ? <p className="loading-text">Loading users...</p> : (
                <div className="table-container">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td><span className={`role-badge role-${user.role}`}>{user.role}</span></td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {users.length === 0 && <tr><td colSpan="4" className="text-center">No users found</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default UserManagement;