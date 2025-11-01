import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

axios.defaults.baseURL = API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const login = async (email: string, password: string) => {
  try {
    const res = await axios.post('/login', { email, password });
    const { user, token } = res.data;

    if (token) {
      localStorage.setItem('docatunis_token', token);
      localStorage.setItem('docatunis_user', JSON.stringify(user));
      // Ajouter le token aux headers par défaut d'axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return { ...user, token }; // Retourner le token avec l'utilisateur
  } catch (err: any) {
    console.error('Erreur backend:', err.response?.data || err.message);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('docatunis_user');
  localStorage.removeItem('docatunis_token');
  // Supprimer le header d'authentification
  delete axios.defaults.headers.common['Authorization'];
};

export const verifySession = async (): Promise<boolean> => {
  const token = localStorage.getItem('docatunis_token');
  if (!token) return false;

  try {
    // Configurer le header Authorization pour cette requête
    const res = await axios.get('/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Si la vérification réussit, configurer le header par défaut
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return !!res.data?.email;
  } catch (err) {
    console.error('Session invalide:', err);
    // Nettoyer le storage si la session est invalide
    logout();
    return false;
  }
};