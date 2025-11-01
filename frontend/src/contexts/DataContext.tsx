import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner"; // Optionnel si on veut des notifications

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt?: string;
};

type Documentary = {
  id: string;
  title: string;
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

  const addUser = (user: User) => setUsers((prev) => [user, ...prev]);
  const deleteUser = (id: string) => setUsers((prev) => prev.filter((u) => u.id !== id));

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
