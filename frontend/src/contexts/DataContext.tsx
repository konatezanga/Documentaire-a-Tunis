import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Documentary {
  id: string;
  code: string;
  title: string;
  date: string;
  subject: string;
  director: {
    code: string;
    firstName: string;
    lastName: string;
    birthDate: string;
  };
  producer: {
    code: string;
    firstName: string;
    lastName: string;
    birthDate: string;
  };
  createdAt: string;
}

export interface Screening {
  id: string;
  documentaryId: string;
  date: string;
  time: string;
  room: string;
  isPublished: boolean;
  createdAt: string;
}

export interface JuryMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  expertise: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  screeningId: string;
  juryMemberId: string;
  score: number;
  createdAt: string;
}

export interface AppUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

interface DataContextType {
  documentaries: Documentary[];
  addDocumentary: (doc: Omit<Documentary, 'id' | 'createdAt'>) => void;
  updateDocumentary: (id: string, doc: Partial<Documentary>) => void;
  deleteDocumentary: (id: string) => void;
  
  screenings: Screening[];
  addScreening: (screening: Omit<Screening, 'id' | 'createdAt'>) => void;
  updateScreening: (id: string, screening: Partial<Screening>) => void;
  deleteScreening: (id: string) => void;
  
  juryMembers: JuryMember[];
  addJuryMember: (member: Omit<JuryMember, 'id' | 'createdAt'>) => void;
  updateJuryMember: (id: string, member: Partial<JuryMember>) => void;
  deleteJuryMember: (id: string) => void;
  
  ratings: Rating[];
  addRating: (rating: Omit<Rating, 'id' | 'createdAt'>) => void;
  
  users: AppUser[];
  addUser: (user: Omit<AppUser, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<AppUser>) => void;
  deleteUser: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documentaries, setDocumentaries] = useState<Documentary[]>([]);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [juryMembers, setJuryMembers] = useState<JuryMember[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);

  // Initialize with mock data
  useEffect(() => {
    const storedDocs = localStorage.getItem('documentaries');
    if (storedDocs) {
      setDocumentaries(JSON.parse(storedDocs));
    } else {
      const mockDocs: Documentary[] = [
        {
          id: '1',
          code: 'DOC001',
          title: 'Les Voix du Sahara',
          date: '2024-11-15',
          subject: 'Culture et traditions du désert tunisien',
          director: {
            code: 'DIR001',
            firstName: 'Nadia',
            lastName: 'Fares',
            birthDate: '1985-03-12'
          },
          producer: {
            code: 'PROD001',
            firstName: 'Youssef',
            lastName: 'Mahjoub',
            birthDate: '1978-07-22'
          },
          createdAt: '2025-01-10'
        }
      ];
      setDocumentaries(mockDocs);
      localStorage.setItem('documentaries', JSON.stringify(mockDocs));
    }

    const storedScreenings = localStorage.getItem('screenings');
    if (storedScreenings) {
      setScreenings(JSON.parse(storedScreenings));
    }

    const storedJury = localStorage.getItem('juryMembers');
    if (storedJury) {
      setJuryMembers(JSON.parse(storedJury));
    } else {
      const mockJury: JuryMember[] = [
        {
          id: '1',
          firstName: 'Sami',
          lastName: 'Zaied',
          email: 'jury1@docatunis.tn',
          expertise: 'Cinéma documentaire africain',
          createdAt: '2025-01-05'
        },
        {
          id: '2',
          firstName: 'Amira',
          lastName: 'Khelifi',
          email: 'jury2@docatunis.tn',
          expertise: 'Anthropologie visuelle',
          createdAt: '2025-01-06'
        }
      ];
      setJuryMembers(mockJury);
      localStorage.setItem('juryMembers', JSON.stringify(mockJury));
    }

    const storedRatings = localStorage.getItem('ratings');
    if (storedRatings) {
      setRatings(JSON.parse(storedRatings));
    }

    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      const mockUsers: AppUser[] = [
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
        }
      ];
      setUsers(mockUsers);
      localStorage.setItem('users', JSON.stringify(mockUsers));
    }
  }, []);

  // Documentary operations
  const addDocumentary = (doc: Omit<Documentary, 'id' | 'createdAt'>) => {
    const newDoc: Documentary = {
      ...doc,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updated = [...documentaries, newDoc];
    setDocumentaries(updated);
    localStorage.setItem('documentaries', JSON.stringify(updated));
  };

  const updateDocumentary = (id: string, doc: Partial<Documentary>) => {
    const updated = documentaries.map(d => d.id === id ? { ...d, ...doc } : d);
    setDocumentaries(updated);
    localStorage.setItem('documentaries', JSON.stringify(updated));
  };

  const deleteDocumentary = (id: string) => {
    const updated = documentaries.filter(d => d.id !== id);
    setDocumentaries(updated);
    localStorage.setItem('documentaries', JSON.stringify(updated));
  };

  // Screening operations
  const addScreening = (screening: Omit<Screening, 'id' | 'createdAt'>) => {
    const newScreening: Screening = {
      ...screening,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updated = [...screenings, newScreening];
    setScreenings(updated);
    localStorage.setItem('screenings', JSON.stringify(updated));
  };

  const updateScreening = (id: string, screening: Partial<Screening>) => {
    const updated = screenings.map(s => s.id === id ? { ...s, ...screening } : s);
    setScreenings(updated);
    localStorage.setItem('screenings', JSON.stringify(updated));
  };

  const deleteScreening = (id: string) => {
    const updated = screenings.filter(s => s.id !== id);
    setScreenings(updated);
    localStorage.setItem('screenings', JSON.stringify(updated));
  };

  // Jury operations
  const addJuryMember = (member: Omit<JuryMember, 'id' | 'createdAt'>) => {
    const newMember: JuryMember = {
      ...member,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updated = [...juryMembers, newMember];
    setJuryMembers(updated);
    localStorage.setItem('juryMembers', JSON.stringify(updated));
  };

  const updateJuryMember = (id: string, member: Partial<JuryMember>) => {
    const updated = juryMembers.map(m => m.id === id ? { ...m, ...member } : m);
    setJuryMembers(updated);
    localStorage.setItem('juryMembers', JSON.stringify(updated));
  };

  const deleteJuryMember = (id: string) => {
    const updated = juryMembers.filter(m => m.id !== id);
    setJuryMembers(updated);
    localStorage.setItem('juryMembers', JSON.stringify(updated));
  };

  // Rating operations
  const addRating = (rating: Omit<Rating, 'id' | 'createdAt'>) => {
    const newRating: Rating = {
      ...rating,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updated = [...ratings, newRating];
    setRatings(updated);
    localStorage.setItem('ratings', JSON.stringify(updated));
  };

  // User operations
  const addUser = (user: Omit<AppUser, 'id' | 'createdAt'>) => {
    const newUser: AppUser = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated));
  };

  const updateUser = (id: string, user: Partial<AppUser>) => {
    const updated = users.map(u => u.id === id ? { ...u, ...user } : u);
    setUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated));
  };

  const deleteUser = (id: string) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated));
  };

  return (
    <DataContext.Provider value={{
      documentaries,
      addDocumentary,
      updateDocumentary,
      deleteDocumentary,
      screenings,
      addScreening,
      updateScreening,
      deleteScreening,
      juryMembers,
      addJuryMember,
      updateJuryMember,
      deleteJuryMember,
      ratings,
      addRating,
      users,
      addUser,
      updateUser,
      deleteUser
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
