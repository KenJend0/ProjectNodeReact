const teamModel = require('../models/teamsModel');
const db = require('../db');

/**
 * Create a new team with the authenticated manager's ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.createTeam = async (req, res) => {
    try {
        const { name, coach_id } = req.body;
        const manager_id = req.user.id;

        if (!name || !coach_id) {
            return res.status(400).json({ error: 'Name and coach ID are required' });
        }

        const newTeam = await teamModel.createTeam({ name, coach_id, manager_id });
        res.status(201).json({
            message: 'Team created successfully',
            team: newTeam,
        });
    } catch (err) {
        console.error('Error creating team:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Get details for a specific team by ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.getTeamDetails = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Team ID is required' });
        }

        const teamDetails = await teamModel.getTeamDetails(id);
        if (!teamDetails) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.status(200).json(teamDetails);
    } catch (err) {
        console.error('Error fetching team details:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Update an existing team by ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, coach_id } = req.body;

        if (!id || !name || !coach_id) {
            return res.status(400).json({ error: 'Team ID, name, and coach ID are required' });
        }

        const updatedTeam = await teamModel.updateTeam(id, { name, coach_id });
        if (!updatedTeam) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.status(200).json({
            message: 'Team updated successfully',
            team: updatedTeam,
        });
    } catch (err) {
        console.error('Error updating team:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Delete a team by ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Team ID is required' });
        }

        const deletedTeam = await teamModel.deleteTeam(id);
        if (!deletedTeam) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.status(200).json({
            message: 'Team deleted successfully',
            id: deletedTeam.id,
        });
    } catch (err) {
        console.error('Error deleting team:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Get all teams in the database.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.getAllTeams = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Teams');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching teams:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
