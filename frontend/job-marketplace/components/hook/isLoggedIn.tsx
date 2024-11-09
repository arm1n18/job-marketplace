'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from "jwt-decode";

export interface Role {
    role: string;
    id: number | null;
    email: string | null;
}

interface AuthContextType {
    isLoggedIn: boolean;
    id: number | null;
    email: string | null;
    role: string | null;
    avatarUrl: string | null;
    setIsLoggedInValue: React.Dispatch<React.SetStateAction<boolean>>;
    setRole: React.Dispatch<React.SetStateAction<string | null>>;
    setId: React.Dispatch<React.SetStateAction<number | null>>;
    setEmail: React.Dispatch<React.SetStateAction<string | null>>;
    setAvatarUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedInValue, setIsLoggedInValue] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [id, setId] = useState<number | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            const avatarURL = localStorage.getItem('image_url');
            if (token) {
                setIsLoggedInValue(true);
                const decodedToken = jwtDecode<Role>(token);
                setRole(decodedToken.role);
                setId(decodedToken.id);
                setEmail(decodedToken.email);
                if (avatarURL) {
                    setAvatarUrl(avatarURL);
                }
            } else {
                setIsLoggedInValue(false);
                setRole(null);
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn: isLoggedInValue, setIsLoggedInValue, setRole, setId, setEmail, role, id, email, avatarUrl, setAvatarUrl }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};