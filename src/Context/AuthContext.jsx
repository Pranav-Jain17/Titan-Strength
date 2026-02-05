import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const backendUrl = 'https://titan-strength.me';

    const apiBase = `${backendUrl}/api/v1/auth`;

    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('titanUser');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Error parsing user from local storage", error);
            return null;
        }
    });

    const [isLoggedin, setIsLoggedin] = useState(() => {
        const token = localStorage.getItem('loginToken');
        const storedUser = localStorage.getItem('titanUser');
        return !!(token && storedUser);
    });

    const [loading, setLoading] = useState(false);

    const login = (userData, token) => {
        setUser(userData);
        setIsLoggedin(true);
        localStorage.setItem('titanUser', JSON.stringify(userData));
        if (token) localStorage.setItem('loginToken', token);
    };

    const logout = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('loginToken');

            await fetch(`${apiBase}/logout`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

        } catch (error) {
            console.error("Backend logout failed:", error);
        } finally {
            setUser(null);
            setIsLoggedin(false);
            localStorage.removeItem('titanUser');
            localStorage.removeItem('loginToken');
            setLoading(false);
        }
    };

    const verifyEmail = async (token) => {
        setLoading(true);
        try {
            const response = await fetch(`${apiBase}/verify-email/${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Email verification failed');
            }

            return data;
        } catch (error) {
            console.error("Verification error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        backendUrl,
        user,
        userData: user,
        setUserData: setUser,
        isLoggedin,
        setIsLoggedin,
        login,
        logout,
        verifyEmail,
        loading,
        setLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};