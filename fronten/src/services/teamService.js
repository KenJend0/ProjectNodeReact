import axios from 'axios';

const API_URL = 'http://localhost:3000/api/teams';

/**
 * Récupère le token JWT depuis localStorage.
 * @returns {string | null} - Le token JWT ou null s'il n'existe pas.
 */
const getToken = () => {
    return localStorage.getItem('token');
};

/**
 * Récupère la liste des équipes.
 * @returns {Promise<object[]>} - Une liste des équipes.
 */
const getTeams = async () => {
    try {
        const token = getToken();
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!Array.isArray(response.data)) {
            throw new Error('API did not return an array');
        }
        return response.data;
    } catch (err) {
        console.error('Error fetching teams:', err.message);
        throw err;
    }
};


/**
 * Crée une nouvelle équipe.
 * @param {object} teamData - Les données de l'équipe (name, coach_id, etc.).
 * @returns {Promise<object>} - Les informations de l'équipe créée.
 */
const createTeam = async (teamData) => {
    if (!teamData || typeof teamData !== 'object') {
        throw new Error('Invalid team data provided to API');
    }

    try {
        const token = getToken();
        const response = await axios.post(API_URL, teamData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (err) {
        console.error('Error creating team:', err.message);
        throw new Error(err.response?.data?.error || 'Failed to create team.');
    }
};

const teamService = {
    getTeams,
    createTeam,
};

export default teamService;
