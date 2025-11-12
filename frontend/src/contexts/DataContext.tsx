import React, { createContext, useContext, useState, useEffect } from "react"; 
import type { ReactNode } from "react";
import { toast } from "sonner";

type User = {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
};

export type Documentary = {
  id: string | number;
  code: string;
  title: string;
  date: string;
  subject: string;
  realisateur: {
    code: string;
    firstName: string;
    lastName: string;
    birthDate: string;
  };
  producteur: {
    code: string;
    firstName: string;
    lastName: string;
    birthDate: string;
  };
};

export type Screening = {
  id: string | number;
  documentaryId: string | number;
  date: string;
  time: string;
  room: string;
  isPublished: boolean;
};

export type JuryMember = {
  id: string | number;
  firstName: string;
  lastName: string;
  expertise: string;
  role?: string;
};

export type Rating = {
  id: string | number;
  screeningId: string | number;
  juryMemberId: string | number;
  score: number;
  createdAt?: string;
};

type DataContextType = {
  users: User[];
  documentaries: Documentary[];
  screenings: Screening[];
  juryMembers: JuryMember[];
  ratings: Rating[];
  fetchUsers: () => Promise<void>;
  addUser: (user: User) => void;
  deleteUser: (id: string) => void;
  fetchDocumentaries: () => void;
  fetchScreenings: () => void;
  fetchJuryMembers: () => void;
  fetchRatings: () => Promise<void>;
  addDocumentary: (documentaryData: any) => Promise<void>;
  updateDocumentary: (id: string, documentaryData: any) => Promise<void>;
  deleteDocumentary: (id: string) => Promise<void>;
  addScreening: (screeningData: any) => Promise<void>;
  updateScreening: (id: string, screeningData: any) => Promise<void>;
  deleteScreening: (id: string) => Promise<void>;
  addRating: (ratingData: any) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [documentaries, setDocumentaries] = useState<Documentary[]>([]);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [juryMembers, setJuryMembers] = useState<JuryMember[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);

  // Charge les données au démarrage de l'application
  useEffect(() => {
    const loadInitialData = async () => {
      const token = localStorage.getItem("docatunis_token");
      if (token) {
        console.log("Chargement des données initiales...");
        await fetchDocumentaries();
        await fetchScreenings();
        await fetchUsers();
        await fetchJuryMembers();
        await fetchRatings();
        console.log("Données initiales chargées");
      }
    };

    loadInitialData();
  }, []);

  // USERS
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("docatunis_token");
      if (!token) {
        console.warn("Aucun token trouvé");
        return;
      }

      const res = await fetch("http://localhost:8000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "content-type": "application/json",
        },
      });

      if (res.status === 401) {
        console.error("Token expiré ou invalide");
        toast.error("Session expirée, veuillez vous reconnecter");
        localStorage.removeItem("docatunis_token");
        localStorage.removeItem("docatunis_user");
        window.location.reload();
        return;
      }

      if (!res.ok) {
        console.error("Erreur API :", res.status);
        toast?.error("Erreur lors du chargement des utilisateurs");
        return;
      }

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Erreur fetchUsers :", error);
      toast?.error("Erreur réseau lors du chargement des utilisateurs");
    }
  };

  const addUser = (user: User) => setUsers((prev: User[]) => [user, ...prev]);
  const deleteUser = (id: string) => setUsers((prev: User[]) => prev.filter((u) => u.id !== id));

  // DOCUMENTARIES
  const fetchDocumentaries = async () => {
    try {
      const token = localStorage.getItem("docatunis_token");
      console.log("Chargement des documentaires...");
      
      const res = await fetch("http://localhost:8000/api/documentaries", {
        headers: { 
          Authorization: `Bearer ${token}`, 
          Accept: "application/json" 
        },
      });
      
      console.log("Statut de la réponse des documentaires:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Documentaires chargés:", data);
        setDocumentaries(data);
      } else {
        console.error("Erreur lors du chargement des documentaires:", res.status);
        try {
          const errorData = await res.json();
          console.error("Détails de l'erreur:", errorData);
        } catch (e) {
          console.error("Impossible de lire les détails de l'erreur");
        }
      }
    } catch (error) {
      console.error("Erreur réseau lors du chargement des documentaires:", error);
    }
  };

  // SCREENINGS
  const fetchScreenings = async () => {
    try {
      const token = localStorage.getItem("docatunis_token");
      console.log("Chargement des projections...");
      
      const res = await fetch("http://localhost:8000/api/screenings", {
        headers: { 
          Authorization: `Bearer ${token}`, 
          Accept: "application/json" 
        },
      });
      
      console.log("Statut de la réponse des projections:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Projections chargées:", data);
        setScreenings(data);
      } else {
        console.error("Erreur lors du chargement des projections:", res.status);
      }
    } catch (error) {
      console.error("Erreur réseau lors du chargement des projections:", error);
    }
  };

  // JURY MEMBERS
  const fetchJuryMembers = async () => {
    try {
      const token = localStorage.getItem("docatunis_token");
      const res = await fetch("http://localhost:8000/api/jury-members", {
        headers: { 
          Authorization: `Bearer ${token}`, 
          Accept: "application/json" 
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setJuryMembers(data);
      } else {
        console.error("Erreur lors du chargement des membres du jury:", res.status);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des membres du jury:", error);
    }
  };

  // RATINGS
  const fetchRatings = async () => {
    try {
      const token = localStorage.getItem("docatunis_token");
      const res = await fetch("http://localhost:8000/api/ratings", {
        headers: { 
          Authorization: `Bearer ${token}`, 
          Accept: "application/json" 
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setRatings(data);
      } else {
        console.error("Erreur lors du chargement des notes:", res.status);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des notes:", error);
    }
  };

  const addRating = async (ratingData: any) => {
    try {
      const token = localStorage.getItem("docatunis_token");
      
      const response = await fetch('http://localhost:8000/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(ratingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'ajout de la note');
      }

      const data = await response.json();
      setRatings(prev => [...prev, data.rating]);
      return data;
      
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  // Méthodes pour les documentaires
  const addDocumentary = async (documentaryData: any) => {
    try {
      const token = localStorage.getItem("docatunis_token");
      
      console.log('Envoi des données au serveur:', documentaryData);
      
      const response = await fetch('http://localhost:8000/api/documentaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(documentaryData),
      });

      console.log('Statut de réponse:', response.status);

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status} lors de l'ajout du documentaire`;
        
        try {
          const errorData = await response.json();
          console.log('Erreurs détaillées du serveur:', errorData);
          
          if (errorData.errors) {
            const validationErrors = Object.entries(errorData.errors)
              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
              .join('; ');
            errorMessage = `Erreurs de validation: ${validationErrors}`;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          const text = await response.text();
          errorMessage = `Erreur serveur: ${text.substring(0, 200)}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Réponse réussie:', data);
      
      setDocumentaries((prev: Documentary[]) => [...prev, data.documentary]);
      return data;
      
    } catch (error) {
      console.error('Erreur complète dans addDocumentary:', error);
      throw error; 
    }
  };

  const updateDocumentary = async (id: string, documentaryData: any) => {
    try {
      const token = localStorage.getItem("docatunis_token");
      
      const response = await fetch(`http://localhost:8000/api/documentaries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(documentaryData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification du documentaire');
      }

      const data = await response.json();
      
      setDocumentaries((prev: Documentary[]) => prev.map(doc => 
        doc.id === id ? data.documentary : doc
      ));
      
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  const deleteDocumentary = async (id: string) => {
    try {
      const token = localStorage.getItem("docatunis_token");
      
      const response = await fetch(`http://localhost:8000/api/documentaries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du documentaire');
      }

      setDocumentaries((prev: Documentary[]) => prev.filter(doc => doc.id !== id));
      
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  const addScreening = async (screeningData: any) => {
    try {
      const token = localStorage.getItem("docatunis_token");
      console.log('[addScreening] Début - Token:', !!token);
      console.log('[addScreening] Données envoyées:', screeningData);
      
      const response = await fetch('http://localhost:8000/api/screenings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(screeningData),
      });

      console.log('[addScreening] Statut réponse:', response.status);
      console.log('[addScreening] Headers réponse:', response.headers);

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status} lors de l'ajout de la projection`;
        
        try {
          const errorData = await response.json();
          console.error('[addScreening] Erreur détaillée:', errorData);
          
          if (errorData.errors) {
            const validationErrors = Object.entries(errorData.errors)
              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
              .join('; ');
            errorMessage = `Erreurs de validation: ${validationErrors}`;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          const text = await response.text();
          console.error('[addScreening] Réponse texte:', text);
          errorMessage = `Erreur serveur: ${text.substring(0, 200)}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('[addScreening] Réponse réussie:', data);
      
      setScreenings((prev: Screening[]) => [...prev, data.screening]);
      return data;
      
    } catch (error) {
      console.error('[addScreening] Erreur complète:', error);
      throw error;
    }
  };

  const updateScreening = async (id: string, screeningData: any) => {
    try {
      const token = localStorage.getItem("docatunis_token");
      
      const response = await fetch(`http://localhost:8000/api/screenings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(screeningData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification de la projection');
      }

      const data = await response.json();
      setScreenings((prev: Screening[]) => prev.map(s => 
        s.id === id ? { ...s, ...data.screening } : s
      ));
      
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  const deleteScreening = async (id: string) => {
    try {
      const token = localStorage.getItem("docatunis_token");
      
      const response = await fetch(`http://localhost:8000/api/screenings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la projection');
      }

      setScreenings((prev: Screening[]) => prev.filter(s => s.id !== id));
      
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider
      value={{
        users,
        documentaries,
        screenings,
        juryMembers,
        ratings,
        fetchUsers,
        addUser,
        deleteUser,
        fetchDocumentaries,
        fetchScreenings,
        fetchJuryMembers,
        fetchRatings,
        addDocumentary, 
        updateDocumentary,
        deleteDocumentary,
        addScreening, 
        updateScreening,
        deleteScreening,
        addRating,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};