import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt?: string;
};

export type Documentary = {
  id: string;
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

type Screening = {
  id: string;
  date: string;
};

type JuryMember = {
  id: string;
  name: string;
  role: string;
};

type DataContextType = {
  users: User[];
  documentaries: Documentary[];
  screenings: Screening[];
  juryMembers: JuryMember[];
  fetchUsers: () => Promise<void>;
  addUser: (user: User) => void;
  deleteUser: (id: string) => void;
  fetchDocumentaries: () => void;
  fetchScreenings: () => void;
  fetchJuryMembers: () => void;
  addDocumentary: (documentaryData: any) => Promise<void>;
  updateDocumentary: (id: string, documentaryData: any) => Promise<void>;
  deleteDocumentary: (id: string) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [documentaries, setDocumentaries] = useState<Documentary[]>([]);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [juryMembers, setJuryMembers] = useState<JuryMember[]>([]);

  //  USERS
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
        // Déconnecter l'utilisateur
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

  //  DOCUMENTARIES
  const fetchDocumentaries = async () => {
    try {
      const token = localStorage.getItem("docatunis_token");
      const res = await fetch("http://localhost:8000/api/documentaries", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setDocumentaries(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //  SCREENINGS
  const fetchScreenings = async () => {
    try {
      const token = localStorage.getItem("docatunis_token");
      const res = await fetch("http://localhost:8000/api/screenings", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setScreenings(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //  JURY MEMBERS
  const fetchJuryMembers = async () => {
    try {
      const token = localStorage.getItem("docatunis_token");
      const res = await fetch("http://localhost:8000/api/jury-members", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setJuryMembers(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Méthodes pour les documentaires
  const addDocumentary = async (documentaryData: any) => {
  try {
    const token = localStorage.getItem("docatunis_token");
    
    console.log('Envoi des données au serveur:', documentaryData); // Debug
    
    const response = await fetch('http://localhost:8000/api/documentaries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(documentaryData),
    });

    console.log('Statut de réponse:', response.status); // Debug

    if (!response.ok) {
      let errorMessage = `Erreur ${response.status} lors de l'ajout du documentaire`;
      
      try {
        const errorData = await response.json();
        console.log('Erreurs détaillées du serveur:', errorData); // Debug
        
        if (errorData.errors) {
          // Laravel validation errors
          const validationErrors = Object.entries(errorData.errors)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('; ');
          errorMessage = `Erreurs de validation: ${validationErrors}`;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (jsonError) {
        // Si la réponse n'est pas du JSON
        const text = await response.text();
        errorMessage = `Erreur serveur: ${text.substring(0, 200)}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Réponse réussie:', data); // Debug
    
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
      
      // Mettre à jour le documentaire dans l'état local
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

      // Supprimer le documentaire de l'état local
      setDocumentaries((prev: Documentary[]) => prev.filter(doc => doc.id !== id));
      
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
        fetchUsers,
        addUser,
        deleteUser,
        fetchDocumentaries,
        fetchScreenings,
        fetchJuryMembers,
        addDocumentary, 
        updateDocumentary,
        deleteDocumentary,
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