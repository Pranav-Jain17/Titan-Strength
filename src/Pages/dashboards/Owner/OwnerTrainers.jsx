import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './ownerManagers.css';

const OwnerTrainers = () => {
    const [trainers, setTrainers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('titanUser');
        return storedUser ? JSON.parse(storedUser).token : null;
    };

    const token = getAuthToken();

    useEffect(() => {
        fetchTrainers();
    }, []);

    const fetchTrainers = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://titan-strength.me/api/v1/manager/trainers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                setTrainers(data.data);
            }
        } catch (error) {
            toast.error("Failed to load trainers");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredTrainers = trainers.filter((trainer) => {
        const term = search.toLowerCase();
        return (
            trainer.name?.toLowerCase().includes(term) ||
            trainer.email?.toLowerCase().includes(term)
        );
    });

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("ID copied to clipboard!");
    };

    return (
        <div className="fade-in">
            <section className="dashboard-section">
                <div className="section-header-flex">
                    <h2>Trainer Overview</h2>
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Search trainers..."
                            value={search}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                    </div>
                </div>

                {loading ? <p className="loading-text">Loading trainers...</p> : (
                    <div className="table-container">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Trainer ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTrainers.map(trainer => (
                                    <tr key={trainer._id}>
                                        <td
                                            onClick={() => copyToClipboard(trainer._id)}
                                            className="clickable-id"
                                            title="Click to copy"
                                        >
                                            {trainer._id}
                                        </td>
                                        <td className="fw-500">{trainer.name}</td>
                                        <td>{trainer.email}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <a href={`mailto:${trainer.email}`} className="btn-secondary">Contact</a>
                                        </td>
                                    </tr>
                                ))}
                                {filteredTrainers.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="empty-state-small">
                                            {search ? "No trainers match your search." : "No trainers found."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default OwnerTrainers;