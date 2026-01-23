import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, login as apiLogin, register as apiRegister, logout as apiLogout } from '@/lib/api-client';

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const userData = await getCurrentUser();
                    setUser(userData);
                } catch (error: any) {
                    if (error.message === 'No autorizado') {
                        localStorage.removeItem('access_token');
                    }
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await apiLogin(email, password);
        const { access_token, user: userData } = response;
        localStorage.setItem('access_token', access_token);
        setUser(userData);
    };

    const register = async (userData: { email: string; password: string; firstName: string; lastName: string }) => {
        const response = await apiRegister(userData);
        const { access_token, user: newUser } = response;
        localStorage.setItem('access_token', access_token);
        setUser(newUser);
    };

    const logout = async () => {
        try {
            await apiLogout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
        localStorage.removeItem('access_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}