const API_BASE_URL = 'http://localhost:8000/api';

export const getHello = async () => {
    const response = await fetch(`${API_BASE_URL}/hello`);
    if (!response.ok) throw new Error('Erreur API');
    return await response.json();
};
