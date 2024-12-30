const db = require('../db');

/**
 * Create a new manager in the database.
 * @param {object} manager - The manager details.
 * @param {string} manager.name - The name of the manager.
 * @param {string} manager.email - The email of the manager.
 * @returns {object} - The newly created manager details.
 */
exports.createManager = async ({ name, email }) => {
    // Insert the manager into the Personne table
    const result = await db.query(
        'INSERT INTO Personne (name, email, role) VALUES ($1, $2, $3) RETURNING id',
        [name, email, 'manager']
    );

    const managerId = result.rows[0].id;

    // Add the manager to the Managers table
    await db.query(
        'INSERT INTO Managers (id) VALUES ($1)',
        [managerId]
    );

    return { id: managerId, name, email };
};

/**
 * Retrieve all teams managed by a specific manager.
 * @param {number} manager_id - The ID of the manager.
 * @returns {Array} - A list of teams managed by the manager.
 */
exports.getTeamsByManager = async (manager_id) => {
    const result = await db.query(
        'SELECT t.id, t.name, t.coach_id FROM Teams t WHERE t.manager_id = $1',
        [manager_id]
    );
    return result.rows;
};
