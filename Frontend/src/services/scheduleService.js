import axios from 'axios';

const API_URL = 'http://localhost:3000/api/schedules';

/**
 * Récupère le token JWT depuis localStorage.
 * @returns {string | null} - Le token JWT ou null s'il n'existe pas.
 */
const getToken = () => {
    return localStorage.getItem('token');
};

/**
 * Récupère les plannings d'une équipe spécifique.
 * @param {number} team_id - L'ID de l'équipe.
 * @returns {Promise<object[]>} - Une liste de plannings.
 */
const getSchedules = async (team_id) => {
    if (!team_id || isNaN(team_id)) {
        throw new Error('Invalid team ID provided to API');
    }

    try {
        const token = getToken();
        const response = await axios.get(`${API_URL}?team_id=${team_id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (err) {
        console.error('Error fetching schedules:', err.message);
        throw new Error(err.response?.data?.error || 'Failed to fetch schedules.');
    }
};

/**
 * Ajoute un nouveau planning pour une équipe.
 * @param {object} scheduleData - Les données du planning (event_type, event_date, etc.).
 * @returns {Promise<object>} - Les informations du planning ajouté.
 */
const addSchedule = async (scheduleData) => {
    if (!scheduleData || typeof scheduleData !== 'object') {
        throw new Error('Invalid schedule data provided to API');
    }

    try {
        const token = getToken();
        const response = await axios.post(API_URL, scheduleData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (err) {
        console.error('Error adding schedule:', err.message);
        throw new Error(err.response?.data?.error || 'Failed to add schedule.');
    }
};

const scheduleService = {
    getSchedules,
    addSchedule,
};

export default scheduleService;
