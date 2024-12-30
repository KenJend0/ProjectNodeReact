const messagesModel = require('../models/messagesModel');

/**
 * Send a message from the current user to another user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.sendMessage = async (req, res) => {
    try {
        const { receiver_id, content } = req.body;
        const sender_id = req.user.id;

        if (!receiver_id || !content) {
            return res.status(400).json({ error: 'Receiver ID and content are required.' });
        }

        const newMessage = await messagesModel.createMessage(sender_id, receiver_id, content);
        res.status(201).json({ message: 'Message sent successfully.', data: newMessage });
    } catch (err) {
        console.error('Error sending message:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Retrieve all messages received by the current user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.getReceivedMessages = async (req, res) => {
    try {
        const user_id = req.user.id;

        const messages = await messagesModel.getReceivedMessages(user_id);
        res.status(200).json(messages);
    } catch (err) {
        console.error('Error fetching received messages:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Retrieve all messages sent by the current user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.getSentMessages = async (req, res) => {
    try {
        const user_id = req.user.id;

        const messages = await messagesModel.getSentMessages(user_id);
        res.status(200).json(messages);
    } catch (err) {
        console.error('Error fetching sent messages:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Retrieve all contacts for the current user based on their role and team ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.getContacts = async (req, res) => {
    try {
        const { role } = req.user;
        const { team_id } = req.query;

        if (!role || !team_id) {
            return res.status(400).json({ error: 'Role and team_id are required.' });
        }

        const contacts = await messagesModel.getContacts(role, team_id);
        res.status(200).json(contacts);
    } catch (err) {
        console.error('Error fetching contacts:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
