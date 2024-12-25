'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

export interface Role {
    role: string;
    id: number | null;
    email: string | null;
}

interface AuthContextType {
    id: number | null;
    email: string | null;
    role: "CANDIDATE" | "RECRUITER";
    avatarUrl: string | null;
    loggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    setRole: React.Dispatch<React.SetStateAction<string | null>>;
    setId: React.Dispatch<React.SetStateAction<number | null>>;
    setEmail: React.Dispatch<React.SetStateAction<string | null>>;
    setAvatarUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

interface AuthProviderProps {
    children: ReactNode;
    isLoggedIn: boolean;
  }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, isLoggedIn }) => {
    const [loggedIn, setLoggedIn] = useState<boolean>(isLoggedIn);
    const [role, setRole] = useState<string | null>(null);
    const [id, setId] = useState<number | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            const avatarURL = localStorage.getItem('image_url');
            if (token) {
                setLoggedIn(true);
                const decodedToken = jwtDecode<Role>(token);
                setRole(decodedToken.role);
                setId(decodedToken.id);
                setEmail(decodedToken.email);
                if (avatarURL) {
                    setAvatarUrl(avatarURL);
                }
            } else {
                setLoggedIn(false);
                setRole(null);
            }
        }
    }, [loggedIn]);

    return (
        <AuthContext.Provider value={{ 
            loggedIn: loggedIn, 
            setLoggedIn, 
            setRole, 
            setId, 
            setEmail, 
            role: role as "CANDIDATE" | "RECRUITER", 
            id, 
            email, 
            avatarUrl, 
            setAvatarUrl 
        }}>
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