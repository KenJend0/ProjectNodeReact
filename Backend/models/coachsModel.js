const db = require('../db');

/**
 * Retrieve the team managed by a specific coach.
 * @param {number} coach_id - The ID of the coach.
 * @returns {object|null} - The team details or null if not found.
 */
exports.getTeamByCoach = async (coach_id) => {
    const result = await db.query(
        'SELECT * FROM Teams WHERE coach_id = $1',
        [coach_id]
    );
    return result.rows[0];
};

/**
 * Create a new coach in the database.
 * @param {object} coach - The coach details.
 * @param {string} coach.name - The name of the coach.
 * @param {string} coach.email - The email of the coach.
 * @returns {object} - The newly created coach details.
 */
exports.createCoach = async ({ name, email }) => {
    // Insert the coach into the Personne table
    const result = await db.query(
        'INSERT INTO Personne (name, email, role) VALUES ($1, $2, $3) RETURNING id',
        [name, email, 'coach']
    );

    const coachId = result.rows[0].id;

    // Add the coach to the Coachs table
    await db.query(
        'INSERT INTO Coachs (id) VALUES ($1)',
        [coachId]
    );

    return { id: coachId, name, email };
};
