const db = require('../db');
const bcrypt = require('bcrypt');

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
 * Create a new coach, assign them to a team, and generate a temporary password.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.createCoach = async (req, res) => {
    const client = await db.connect();
    try {
        const { name, email, team_id } = req.body;

        if (!name || !email || !team_id) {
            return res.status(400).json({ error: 'All fields are required: name, email, team_id' });
        }

        await client.query('BEGIN'); // Start transaction

        // Check if the email already exists
        const emailCheck = await client.query('SELECT id FROM Personne WHERE email = $1;', [email]);
        if (emailCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Email already exists.' });
        }

        // Generate a random password and hash it
        const randomPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        // Insert into Personne table and get the new ID
        const insertPersonResult = await client.query(
            `INSERT INTO Personne (name, email, role, password) VALUES ($1, $2, 'coach', $3) RETURNING id;`,
            [name, email, randomPassword]
        );

        const coachId = insertPersonResult.rows[0].id;

        // Insert into Coachs table with team_id
        const insertCoachResult = await client.query(
            `INSERT INTO Coachs (id, team_id) VALUES ($1, $2);`,
            [coachId, team_id]
        );

        if (insertCoachResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(500).json({ error: 'Failed to add coach to Coachs table.' });
        }

        // Update Teams table with coach_id
        const updateTeamResult = await client.query(
            `UPDATE Teams SET coach_id = $1 WHERE id = $2 RETURNING *;`,
            [coachId, team_id]
        );

        if (updateTeamResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Team not found.' });
        }

        await client.query('COMMIT'); // Commit transaction

        res.status(201).json({
            message: 'Coach created successfully',
            coach: { id: coachId, name, email },
            temporaryPassword: randomPassword,
        });

        console.log('Temporary Password sent:', randomPassword);
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.error('Error creating coach:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release(); // Release the connection
    }
};
