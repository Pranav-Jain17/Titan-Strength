const UserDashboard = () => {
    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
            <h1>User Dashboard</h1>
            <p>Welcome! You are logged in.</p>
            <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px' }}>
                <h3>Account Status: Free User</h3>
                <p>You have not purchased a membership yet.</p>
                <button style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}>
                    Buy Membership
                </button>
            </div>
        </div>
    );
};

export default UserDashboard;