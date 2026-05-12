'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import authService from '@/services/authService';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: 'teacher' | 'principal',
    principalCode?: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const storedToken = authService.getStoredToken();
        const storedUser = authService.getStoredUser();

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
        }

        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        setIsLoading(true);
        try {
            const data = await authService.login(email, password);
            authService.saveSession(data.token, data.user);
            setToken(data.token);
            setUser(data.user);

            if (data.user.role === 'teacher') {
                router.push('/teacher/dashboard');
            } else if (data.user.role === 'principal') {
                router.push('/principal/dashboard');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (
        name: string,
        email: string,
        password: string,
        role: 'teacher' | 'principal',
        principalCode?: string
    ): Promise<void> => {
        setIsLoading(true);
        try {
            const data = await authService.register(name, email, password, role, principalCode);
            authService.saveSession(data.token, data.user);
            setToken(data.token);
            setUser(data.user);

            if (data.user.role === 'teacher') {
                router.push('/teacher/dashboard');
            } else if (data.user.role === 'principal') {
                router.push('/principal/dashboard');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const logout = (): void => {
        authService.logout();
        setUser(null);
        setToken(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isLoggedIn: !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
}