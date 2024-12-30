const db = require('../db');

/**
 * Retrieve all schedules for a specific team.
 * @param {number} team_id - The ID of the team.
 * @returns {Array} - A list of schedules ordered by event date and start time.
 */
exports.getSchedulesByTeam = async (team_id) => {
    const result = await db.query(
        'SELECT * FROM Schedules WHERE team_id = $1 ORDER BY event_date, start_time',
        [team_id]
    );
    return result.rows;
};

/**
 * Add a new schedule to the database.
 * @param {object} schedule - The schedule details.
 * @param {string} schedule.event_type - The type of the event.
 * @param {string} schedule.event_date - The date of the event.
 * @param {string} schedule.start_time - The start time of the event.
 * @param {string} schedule.end_time - The end time of the event.
 * @param {string} schedule.location - The location of the event.
 * @param {string} [schedule.description] - A description of the event.
 * @param {number} schedule.team_id - The ID of the team.
 * @returns {object} - The newly created schedule.
 */
exports.addSchedule = async ({ event_type, event_date, start_time, end_time, location, description, team_id }) => {
    const query = `
        INSERT INTO Schedules (event_type, event_date, start_time, end_time, location, description, team_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
    `;
    const values = [event_type, event_date, start_time, end_time, location, description, team_id];
    const result = await db.query(query, values);
    return result.rows[0];
};

/**
 * Update an existing schedule in the database.
 * @param {number} id - The ID of the schedule to update.
 * @param {object} updates - The updated schedule details.
 * @param {string} [updates.event_type] - The updated type of the event.
 * @param {string} [updates.event_date] - The updated date of the event.
 * @param {string} [updates.start_time] - The updated start time of the event.
 * @param {string} [updates.end_time] - The updated end time of the event.
 * @param {string} [updates.location] - The updated location of the event.
 * @param {string} [updates.description] - The updated description of the event.
 * @returns {object} - The updated schedule.
 */
exports.updateSchedule = async (id, { event_type, event_date, start_time, end_time, location, description }) => {
    const result = await db.query(
        `UPDATE Schedules
         SET event_type = COALESCE($1, event_type),
             event_date = COALESCE($2, event_date),
             start_time = COALESCE($3, start_time),
             end_time = COALESCE($4, end_time),
             location = COALESCE($5, location),
             description = COALESCE($6, description)
         WHERE id = $7
             RETURNING *`,
        [event_type, event_date, start_time, end_time, location, description, id]
    );
    return result.rows[0];
};

/**
 * Delete a schedule from the database.
 * @param {number} id - The ID of the schedule to delete.
 * @returns {object|null} - The ID of the deleted schedule or null if not found.
 */
exports.deleteSchedule = async (id) => {
    const result = await db.query(
        'DELETE FROM Schedules WHERE id = $1 RETURNING id',
        [id]
    );
    return result.rows[0];
};
