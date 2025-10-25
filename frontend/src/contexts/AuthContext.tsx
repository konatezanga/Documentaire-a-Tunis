import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'inspection_manager' | 'production_manager' | 'jury_president' | 'jury_member' | null;

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@docatunis.tn',
    firstName: 'Ahmed',
    lastName: 'Ben Ali',
    role: 'admin',
    createdAt: '2025-01-01'
  },
  {
    id: '2',
    email: 'inspection@docatunis.tn',
    firstName: 'Leila',
    lastName: 'Mansour',
    role: 'inspection_manager',
    createdAt: '2025-01-02'
  },
  {
    id: '3',
    email: 'production@docatunis.tn',
    firstName: 'Karim',
    lastName: 'Trabelsi',
    role: 'production_manager',
    createdAt: '2025-01-03'
  },
  {
    id: '4',
    email: 'president@docatunis.tn',
    firstName: 'Fatma',
    lastName: 'Bouazizi',
    role: 'jury_president',
    createdAt: '2025-01-04'
  },
  {
    id: '5',
    email: 'jury1@docatunis.tn',
    firstName: 'Sami',
    lastName: 'Zaied',
    role: 'jury_member',
    createdAt: '2025-01-05'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('docatunis_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in production, this would call an API
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('docatunis_user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('docatunis_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
