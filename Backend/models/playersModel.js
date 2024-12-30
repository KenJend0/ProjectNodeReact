const db = require('../db');
const bcrypt = require('bcrypt');

/**
 * Generate a temporary random password.
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
 * Add a new player to the database.
 * @param {object} player - The player details.
 * @param {string} player.name - The name of the player.
 * @param {string} player.email - The email of the player.
 * @param {string} player.position - The position of the player.
 * @param {number} player.team_id - The ID of the team.
 * @returns {object} - The newly added player details with the temporary password.
 */
exports.addPlayer = async ({ name, email, position, team_id }) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        const randomPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const personResult = await client.query(
            'INSERT INTO Personne (name, email, role, password) VALUES ($1, $2, $3, $4) RETURNING id',
            [name, email, 'player', randomPassword]
        );
        const playerId = personResult.rows[0].id;

        await client.query(
            'INSERT INTO Players (id, position, team_id) VALUES ($1, $2, $3)',
            [playerId, position, team_id]
        );

        await client.query('COMMIT');

        return { id: playerId, name, email, position, team_id, password: randomPassword };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

/**
 * Retrieve stats for a specific player.
 * @param {number} playerId - The ID of the player.
 * @returns {object} - The player's stats.
 */
exports.getPlayerStats = async (playerId) => {
    const result = await db.query(
        `SELECT
             p.position,
             p.buts AS goals,
             (SELECT COUNT(*)
              FROM schedules
              WHERE event_type = 'Game' AND team_id = (
                  SELECT team_id FROM players WHERE id = $1
              )) AS matches
         FROM players p
         WHERE p.id = $1;
        `,
        [playerId]
    );
    return result.rows[0];
};

/**
 * Retrieve all players for a specific team.
 * @param {number} team_id - The ID of the team.
 * @returns {Array} - A list of players in the team.
 */
exports.getPlayersByTeam = async (team_id) => {
    const result = await db.query(
        `SELECT p.id, pe.name, pe.email, p.position, p.buts
         FROM Players p
                  INNER JOIN Personne pe ON p.id = pe.id
         WHERE p.team_id = $1`,
        [team_id]
    );
    return result.rows;
};

/**
 * Delete a player from the database.
 * @param {number} player_id - The ID of the player.
 * @returns {number|null} - The ID of the deleted player or null if not found.
 */
exports.deletePlayer = async (player_id) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        const playerResult = await client.query(
            'SELECT id FROM Players WHERE id = $1',
            [player_id]
        );

        if (playerResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        const personId = playerResult.rows[0].id;

        await client.query('DELETE FROM Players WHERE id = $1', [player_id]);
        await client.query('DELETE FROM Personne WHERE id = $1', [personId]);

        await client.query('COMMIT');
        return player_id;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

/**
 * Update a player's information.
 * @param {number} player_id - The ID of the player.
 * @param {object} data - The updated player details.
 * @param {string} [data.name] - The new name of the player.
 * @param {string} [data.position] - The new position of the player.
 * @param {number} [data.buts] - The updated number of goals scored.
 * @returns {object|null} - The updated player details or null if not found.
 */
exports.updatePlayer = async (player_id, { name, position, buts }) => {
    const result = await db.query(
        'UPDATE Players SET position = COALESCE($1, position), buts = COALESCE($2, buts) WHERE id = $3 RETURNING *',
        [position, buts, player_id]
    );
    return result.rows[0];
};
