const db = require('../db');

/**
 * Register a new user in the database.
 * @param {object} user - The user details.
 * @param {string} user.name - The name of the user.
 * @param {string} user.email - The email of the user.
 * @param {string} user.password - The hashed password of the user.
 * @param {string} user.role - The role of the user.
 * @returns {object} - The newly created user.
 */
exports.registerUser = async ({ name, email, password, role }) => {
    const result = await db.query(
        'INSERT INTO Personne (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, password, role]
    );
    return result.rows[0];
};

/**
 * Retrieve a user by their email.
 * @param {string} email - The email of the user.
 * @returns {object|null} - The user details or null if not found.
 */
exports.getUserByEmail = async (email) => {
    const result = await db.query('SELECT * FROM Personne WHERE email = $1', [email]);
    return result.rows[0];
};
