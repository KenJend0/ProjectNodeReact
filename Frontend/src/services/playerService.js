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
 * Récupère les joueurs d'une équipe spécifique.
 * @param {number} team_id - L'ID de l'équipe.
 * @returns {Promise<object[]>} - Une liste des joueurs.
 */
const getPlayers = async (team_id) => {
    if (!team_id || isNaN(team_id)) {
        throw new Error('Invalid team ID provided to API');
    }

    try {
        const token = getToken();
        const response = await axios.get(`${API_URL}?team_id=${team_id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
        console.error('Error fetching players:', err.message);
        throw new Error(err.response?.data?.error || 'Failed to fetch players.');
    }
};

/**
 * Crée un nouveau joueur.
 * @param {object} playerData - Les données du joueur (name, email, position, etc.).
 * @returns {Promise<object>} - Les informations du joueur créé.
 */
const createPlayer = async (playerData) => {
    try {
        const token = getToken();
        const response = await axios.post(API_URL, playerData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (err) {
        console.error('Error creating player:', err.message);
        throw new Error(err.response?.data?.error || 'Failed to create player.');
    }
};

/**
 * Supprime un joueur spécifique.
 * @param {number} playerId - L'ID du joueur à supprimer.
 * @returns {Promise<object>} - Les informations du joueur supprimé.
 */
const deletePlayer = async (playerId) => {
    if (!playerId || isNaN(playerId)) {
        throw new Error('Invalid player ID provided to API');
    }

    try {
        const token = getToken();
        const response = await axios.delete(`${API_URL}/${playerId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (err) {
        console.error('Error deleting player:', err.message);
        throw new Error(err.response?.data?.error || 'Failed to delete player.');
    }
};

/**
 * Met à jour les informations d'un joueur spécifique.
 * @param {number} playerId - L'ID du joueur à mettre à jour.
 * @param {object} playerData - Les données du joueur à mettre à jour.
 * @returns {Promise<object>} - Les informations mises à jour du joueur.
 */
const updatePlayer = async (playerId, playerData) => {
    if (!playerId || isNaN(playerId)) {
        throw new Error('Invalid player ID provided to API');
    }

    try {
        const token = getToken();
        const response = await axios.put(`${API_URL}/${playerId}`, playerData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (err) {
        console.error('Error updating player:', err.message);
        throw new Error(err.response?.data?.error || 'Failed to update player.');
    }
};

const playerService = {
    getPlayers,
    createPlayer,
    deletePlayer,
    updatePlayer,
};

export default playerService;
