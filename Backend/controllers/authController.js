const jwt = require('jsonwebtoken');
const db = require('../db');
const bcrypt = require('bcrypt');
const authModel = require('../models/authModel');

/**
 * Retrieve the team ID based on the user role.
 * @param {number} userId - The ID of the user.
 * @param {string} role - The role of the user (manager, coach, or player).
 * @returns {Promise<number|null>} - The team ID or null if not found.
 */
const getTeamId = async (userId, role) => {
    try {
        let query, params;

        switch (role) {
            case 'manager':
                query = 'SELECT id FROM Teams WHERE manager_id = $1';
                params = [userId];
                break;
            case 'coach':
                query = 'SELECT id FROM Teams WHERE coach_id = $1';
                params = [userId];
                break;
            case 'player':
                query = 'SELECT team_id FROM Players WHERE id = $1';
                params = [userId];
                break;
            default:
                return null;
        }

        const result = await db.query(query, params);
        return result.rows[0]?.id || result.rows[0]?.team_id || null;
    } catch (err) {
        console.error('Error in getTeamId:', err.message);
        throw new Error('Failed to retrieve team ID');
    }
};

/**
 * Handle user login and generate JWT token.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const userResult = await db.query('SELECT * FROM Personne WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare the provided password with the stored one
        if (password !== user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const teamId = await getTeamId(user.id, user.role);

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role, team_id: teamId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, role: user.role, team_id: teamId });
    } catch (err) {
        console.error('Error in login:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Handle user registration.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await authModel.registerUser({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
        });
    } catch (err) {
        console.error('Error in register:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};