import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import axios from 'axios';

export type UserRole =
  | 'admin'
  | 'inspection_manager'
  | 'production_manager'
  | 'jury_president'
  | 'jury_member'
  | null;

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  token?: string; // Ajouter le token dans l'interface User
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('docatunis_user');
      const token = localStorage.getItem('docatunis_token');
      
      if (storedUser && token) {
        try {
          const isValid = await authService.verifySession();
          if (isValid) {
            const user = JSON.parse(storedUser);
            setUser(user);
            // Configurer axios avec le token
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          } else {
            authService.logout();
          }
        } catch (error) {
          console.error('Erreur vérification session:', error);
          authService.logout();
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await authService.login(email, password);
      if (result) {
        const userWithToken = {
          ...result,
          token: result.token // S'assurer que le token est inclus
        };
        setUser(userWithToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur login:', error);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};