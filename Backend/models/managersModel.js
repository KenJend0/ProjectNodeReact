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

/**
 * Retrieve the coach in charge of a specific team.
 * @param {number} team_id - The ID of the manager.
 * @returns {number} - The id of coach.
 */
exports.getCoachByTeam = async (team_id) => {
    const { rows } = await db.query(
        `SELECT coach_id
     FROM teams
     WHERE id = $1`,
        [team_id]
    );
    if (rows.length === 0) return null;
    return rows[0].coach_id;
};

/**
 * Create a new Team in the database.
 * @param {object} Team - The Team details.
 * @param {string} Team.name - The name of the Team.
 * @param {number} Team.coach_id - The coach_id of the team.
 * @param {number} Team.manager_id - The coach_id of the team.
 * @returns {object} - The newly created Team details.
 */
exports.createTeam = async ({ name, coach_id, manager_id }) => {
    const insertTeam = `
    INSERT INTO teams (name, coach_id, manager_id)
    VALUES ($1, $2, $3)
    RETURNING id, name, coach_id, manager_id
  `;
    const { rows } = await db.query(insertTeam, [name, coach_id, manager_id]);
    return rows[0];
};

/**
 * Retrieve a manager by its ID.
 * Returns null if not found.
 */
exports.getManagerById = async (id) => {
    const sql = `
    SELECT u.id,
           u.name,
           u.email,
           u.created_at,
           u.updated_at,
           m.full_name
      FROM personne u
      JOIN managers m ON m.id = u.id
     WHERE u.id = $1
  `;
    const { rows } = await db.query(sql, [id]);
    return rows[0] || null;
};

/**
 * List managers with pagination.
 * Returns an object { rows: [...], total: number }.
 */
exports.getManagers = async ({ limit, offset }) => {
    // 1) Fetch the page of managers
    const listSql = `
    SELECT u.id,
           u.name,
           u.email,
           u.created_at,
           m.full_name
      FROM personne u
      JOIN managers m ON m.id = u.id
     ORDER BY u.created_at DESC
     LIMIT $1 OFFSET $2
  `;
    const { rows } = await db.query(listSql, [limit, offset]);

    // 2) Count total managers
    const countSql = `SELECT COUNT(*)::int AS count FROM managers`;
    const { rows: countRows } = await db.query(countSql);
    const total = countRows[0].count;

    return { rows, total };
};

/**
 * Update a manager’s record (users + profile).
 * Only updates the fields provided.
 * Returns the updated object, or null if not found.
 */
exports.updateManager = async (id, { name, email, full_name }) => {
    // Build dynamic SET clauses
    const sets = [];
    const values = [];
    let idx = 1;

    if (name) {
        sets.push(`u.name = $${idx++}`);
        values.push(name);
    }
    if (email) {
        sets.push(`u.email = $${idx++}`);
        values.push(email);
    }
    if (full_name) {
        sets.push(`m.full_name = $${idx++}`);
        values.push(full_name);
    }
    if (sets.length === 0) return null;

    // 1) Update personne table
    const personSets = sets.filter(s => s.startsWith('u.'));
    if (personSets.length) {
        const sqlU = `
      UPDATE personne u
         SET ${personSets.join(', ')}
       WHERE u.id = $${idx}
    `;
        await db.query(sqlU, [...values.slice(0, personSets.length), id]);
    }

    // 2) Update managers table
    const managerSets = sets.filter(s => s.startsWith('m.'));
    if (managerSets.length) {
        const sqlM = `
      UPDATE managers m
         SET ${managerSets.map(s => s.replace(/^m\./, '')).join(', ')}
       WHERE m.id = $${idx}
    `;
        await db.query(sqlM, [...values.slice(personSets.length), id]);
    }

    // Return the refreshed manager
    return this.getManagerById(id);
};

/**
 * Delete a manager (cascades via FK on personne).
 * Returns true if deleted, false otherwise.
 */
exports.deleteManager = async (id) => {
    const { rowCount } = await db.query(
        'DELETE FROM personne WHERE id = $1',
        [id]
    );
    return rowCount > 0;
};