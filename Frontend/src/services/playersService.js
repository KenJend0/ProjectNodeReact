import axios from 'axios';

const API_URL = 'http://localhost:3000/api/players';

/**
 * Récupère le token JWT depuis localStorage.
 * @returns {string | null} - Le token JWT ou null s'il n'existe pas.
 */
const getToken = () => {
    return localStorage.getItem('token');
};

/**
 * Récupère les statistiques d'un joueur spécifique.
 * @param {number} playerId - L'ID du joueur.
 * @returns {Promise<object>} - Les statistiques du joueur.
 */
const getPlayerStats = async (playerId) => {
    if (!playerId || isNaN(playerId)) {
        throw new Error('Invalid player ID provided to API');
    }

    try {
        const token = getToken();
        const response = await axios.get(`${API_URL}/${playerId}/stats`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (err) {
        console.error('Error fetching player stats:', err.message);
        throw new Error(err.response?.data?.error || 'Failed to fetch player stats.');
    }
};

const playersService = {
    getPlayerStats,
};

export default playersService;
