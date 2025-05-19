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
    const sql = `
    INSERT INTO personne (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at
  `;
    const { rows } = await db.query(sql, [name, email, password, role]);
    return rows[0];
};

/**
 * Retrieve a user by their email.
 * @param {string} email - The email of the user.
 * @returns {object|null} - The user details or null if not found.
 */
exports.getUserByEmail = async (email) => {
    const { rows } = await db.query(
        'SELECT id, name, email, password, role FROM personne WHERE email = $1',
        [email]
    );
    return rows[0] || null;
};

/**
 * Retrieve the team ID based on user role.
 */
exports.getTeamId = async (userId, role) => {
    let sql, params;
    switch (role) {
        case 'manager':
            sql = 'SELECT id FROM teams WHERE manager_id = $1';
            params = [userId];
            break;
        case 'coach':
            // si relation n–n via team_coaches :
            sql = `
        SELECT team_id
          FROM team_coaches
         WHERE coach_id = $1
         LIMIT 1
      `;
            params = [userId];
            break;
        case 'player':
            sql = 'SELECT team_id FROM players WHERE id = $1';
            params = [userId];
            break;
        default:
            return null;
    }
    const { rows } = await db.query(sql, params);
    return rows[0]?.id || rows[0]?.team_id || null;
};