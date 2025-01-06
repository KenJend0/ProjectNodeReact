import axios from 'axios';

const API_URL = 'http://localhost:3000/api/messages';

/**
 * Récupère le token JWT depuis localStorage.
 * @returns {string | null} - Le token JWT ou null s'il n'existe pas.
 */
const getToken = () => {
    return localStorage.getItem('token');
};

/**
 * Envoie un message à un utilisateur spécifique.
 * @param {object} messageData - Les données du message (receiver_id, content).
 * @returns {Promise<object>} - La réponse de l'API.
 */
const sendMessage = async (messageData) => {
    try {
        const token = getToken();
        const response = await axios.post(API_URL, messageData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (err) {
        console.error('Error sending message:', err.message);
        throw new Error(err.response?.data?.error || 'Failed to send message.');
    }
};

/**
 * Récupère les messages reçus par l'utilisateur.
 * @returns {Promise<object[]>} - La liste des messages reçus.
 */
const getReceivedMessages = async () => {
    try {
        const token = getToken();
        const response = await axios.get(`${API_URL}/received`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (err) {
        console.error('Error fetching received messages:', err.message);
        throw new Error(err.response?.data?.error || 'Failed to fetch received messages.');
    }
};

/**
 * Récupère les messages envoyés par l'utilisateur.
 * @returns {Promise<object[]>} - La liste des messages envoyés.
 */
const getSentMessages = async () => {
    try {
        const token = getToken();
        const response = await axios.get(`${API_URL}/sent`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (err) {
        console.error('Error fetching sent messages:', err.message);
        throw new Error(err.response?.data?.error || 'Failed to fetch sent messages.');
    }
};

/**
 * Récupère la liste des contacts disponibles pour l'utilisateur.
 * @param {string} role - Le rôle de l'utilisateur (coach, player, etc.).
 * @param {number} team_id - L'ID de l'équipe.
 * @returns {Promise<object[]>} - La liste des contacts disponibles.
 */
const getContacts = async (role, team_id) => {
    if (!role || !team_id) {
        throw new Error('Role and team_id are required.');
    }

    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/contacts`, {
            params: { role, team_id },
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (err) {
        console.error('Error fetching contacts:', err.message);
        throw new Error(err.response?.data?.error || 'Failed to fetch contacts.');
    }
};


const messageService = {
    sendMessage,
    getReceivedMessages,
    getSentMessages,
    getContacts,
};

export default messageService;
