const playersModel = require('../models/playersModel');
const db = require('../db');

/**
 * Generate a random password with a specified length.
 * @param {number} length - The length of the password.
 * @returns {string} - The generated password.
 */
const generateRandomPassword = (length = 8) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

/**
 * Add a new player to the database and associate them with a team.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.addPlayer = async (req, res) => {
    const client = await db.connect();
    try {
        const { name, email, position, team_id } = req.body;

        if (!name || !email || !position || !team_id) {
            return res.status(400).json({ error: 'All fields are required: name, email, position, team_id' });
        }

        await client.query('BEGIN'); // Start transaction

        // Check if the email already exists
        const emailCheck = await client.query('SELECT id FROM Personne WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Email already exists.' });
        }

        // Generate a random password
        const randomPassword = generateRandomPassword();

        // Insert into Personne table
        const personResult = await client.query(
            `INSERT INTO Personne (name, email, role, password) VALUES ($1, $2, 'player', $3) RETURNING id`,
            [name, email, randomPassword]
        );

        const personId = personResult.rows[0].id;

        // Insert into Players table
        await client.query(
            `INSERT INTO Players (id, position, buts, team_id) VALUES ($1, $2, 0, $3)`,
            [personId, position, team_id]
        );

        await client.query('COMMIT'); // Commit transaction
        res.status(201).json({
            message: 'Player created successfully',
            player: { id: personId, name, position, team_id },
            temporaryPassword: randomPassword,
        });
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.error('Error adding player:', err.message);
        res.status(500).json({ error: 'Server error' });
    } finally {
        client.release();
    }
};

/**
 * Retrieve stats for a specific player.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.getPlayerStats = async (req, res) => {
    try {
        const { id } = req.params;
        const stats = await playersModel.getPlayerStats(id);
        res.status(200).json(stats);
    } catch (err) {
        console.error('Error fetching player stats:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Retrieve all players associated with the current user's team.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.getPlayersByTeam = async (req, res) => {
    try {
        const { team_id } = req.user;

        if (!team_id) {
            return res.status(400).json({ error: 'No team ID associated with user' });
        }

        const result = await db.query(
            `SELECT p.id, p.name, pl.position, pl.buts
             FROM Players pl
                      JOIN Personne p ON pl.id = p.id
             WHERE pl.team_id = $1`,
            [team_id]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching players:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Delete a player by their ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.deletePlayer = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPlayer = await playersModel.deletePlayer(id);
        if (!deletedPlayer) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.status(200).json({ message: 'Player deleted successfully' });
    } catch (err) {
        console.error('Error deleting player:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Update player information.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.updatePlayer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, position, buts } = req.body;

        const updatedPlayer = await playersModel.updatePlayer(id, { name, position, buts });

        if (!updatedPlayer) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.status(200).json(updatedPlayer);
    } catch (err) {
        console.error('Error updating player:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};
