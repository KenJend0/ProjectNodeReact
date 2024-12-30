const db = require('../db');

/**
 * Create a new team in the database.
 * @param {object} team - The team details.
 * @param {string} team.name - The name of the team.
 * @param {number} team.coach_id - The ID of the coach.
 * @param {number} team.manager_id - The ID of the manager.
 * @returns {object} - The newly created team details.
 */
exports.createTeam = async ({ name, coach_id, manager_id }) => {
    const result = await db.query(
        'INSERT INTO Teams (name, coach_id, manager_id) VALUES ($1, $2, $3) RETURNING *',
        [name, coach_id, manager_id]
    );
    return result.rows[0];
};

/**
 * Retrieve details for a specific team, including its players.
 * @param {number} team_id - The ID of the team.
 * @returns {object|null} - The team details with players or null if not found.
 */
exports.getTeamDetails = async (team_id) => {
    const teamResult = await db.query(
        'SELECT * FROM Teams WHERE id = $1',
        [team_id]
    );

    if (teamResult.rows.length === 0) {
        return null; // Team not found
    }

    const playersResult = await db.query(
        'SELECT p.id, p.name, p.position, p.buts FROM Players p WHERE p.team_id = $1',
        [team_id]
    );

    return {
        team: teamResult.rows[0],
        players: playersResult.rows
    };
};

/**
 * Update an existing team in the database.
 * @param {number} team_id - The ID of the team.
 * @param {object} updates - The updated team details.
 * @param {string} [updates.name] - The updated name of the team.
 * @param {number} [updates.coach_id] - The updated ID of the coach.
 * @returns {object|null} - The updated team details or null if not found.
 */
exports.updateTeam = async (team_id, { name, coach_id }) => {
    const result = await db.query(
        'UPDATE Teams SET name = COALESCE($1, name), coach_id = COALESCE($2, coach_id) WHERE id = $3 RETURNING *',
        [name, coach_id, team_id]
    );
    return result.rows[0];
};

/**
 * Delete a team from the database, including associated schedules and players.
 * @param {number} team_id - The ID of the team to delete.
 * @returns {object|null} - The ID of the deleted team or null if not found.
 */
exports.deleteTeam = async (team_id) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        // Delete schedules associated with the team
        await client.query(
            'DELETE FROM Schedules WHERE team_id = $1',
            [team_id]
        );

        // Delete players associated with the team
        await client.query(
            'DELETE FROM Players WHERE team_id = $1',
            [team_id]
        );

        // Delete the team
        const result = await client.query(
            'DELETE FROM Teams WHERE id = $1 RETURNING id',
            [team_id]
        );

        await client.query('COMMIT'); // Commit transaction

        return result.rows[0];
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        throw err;
    } finally {
        client.release(); // Release the connection
    }
};
