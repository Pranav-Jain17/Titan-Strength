import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const backendUrl = 'https://titan-strength.me';

    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('titanUser');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
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

    const logout = () => {
        setUser(null);
        setIsLoggedin(false);
        localStorage.removeItem('titanUser');
        localStorage.removeItem('loginToken');
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
        loading
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