const db = require('../db');

/**
 * Create a new message in the database.
 * @param {number} sender_id - The ID of the sender.
 * @param {number} receiver_id - The ID of the receiver.
 * @param {string} content - The content of the message.
 * @returns {object} - The newly created message.
 */
exports.createMessage = async (sender_id, receiver_id, content) => {
    const result = await db.query(
        `INSERT INTO Messages (sender_id, receiver_id, message, timestamp)
         VALUES ($1, $2, $3, NOW()) RETURNING id, sender_id, receiver_id, message, timestamp`,
        [sender_id, receiver_id, content]
    );
    return result.rows[0];
};

/**
 * Retrieve all messages received by a specific user.
 * @param {number} user_id - The ID of the user.
 * @returns {Array} - A list of received messages.
 */
exports.getReceivedMessages = async (user_id) => {
    const result = await db.query(
        `SELECT
             m.id,
             m.sender_id,
             m.message,
             m.timestamp,
             p.name AS sender_name
         FROM Messages m
                  INNER JOIN Personne p ON m.sender_id = p.id
         WHERE m.receiver_id = $1
         ORDER BY m.timestamp DESC`,
        [user_id]
    );
    return result.rows;
};

/**
 * Retrieve all messages sent by a specific user.
 * @param {number} user_id - The ID of the user.
 * @returns {Array} - A list of sent messages.
 */
exports.getSentMessages = async (user_id) => {
    const result = await db.query(
        `SELECT
             m.id,
             m.receiver_id,
             m.message,
             m.timestamp,
             p.name AS receiver_name
         FROM Messages m
                  INNER JOIN Personne p ON m.receiver_id = p.id
         WHERE m.sender_id = $1
         ORDER BY m.timestamp DESC`,
        [user_id]
    );
    return result.rows;
};

/**
 * Retrieve contacts based on the user's role and team ID.
 * @param {string} role - The role of the user (manager, coach, or player).
 * @param {number} team_id - The team ID of the user.
 * @returns {Array} - A list of contacts for the user.
 */
exports.getContacts = async (role, team_id) => {
    let query;

    if (role === 'manager') {
        query = `
            SELECT id, name, role
            FROM Personne`;
        const result = await db.query(query);
        return result.rows;
    }

    if (role === 'coach') {
        query = `
            SELECT id, name, role
            FROM Personne
            WHERE id IN (
                SELECT id FROM Players WHERE team_id = $1
                UNION
                SELECT id FROM Personne WHERE role = 'manager'
                UNION
                SELECT id FROM Personne WHERE role = 'coach'
            )`;
        const result = await db.query(query, [team_id]);
        return result.rows;
    }

    if (role === 'player') {
        query = `
            SELECT id, name, role
            FROM Personne
            WHERE id IN (
                SELECT id FROM Players WHERE team_id = $1
                UNION
                SELECT id FROM Personne WHERE role = 'coach'
                UNION
                SELECT id FROM Personne WHERE role = 'manager'
            )`;
        const result = await db.query(query, [team_id]);
        return result.rows;
    }

    throw new Error('Invalid role');
};
