const managersModel = require('../models/managersModel');

/**
 * Create a new manager.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.createManager = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const newManager = await managersModel.createManager({ name, email });
        res.status(201).json({
            message: 'Manager created successfully',
            manager: newManager,
        });
    } catch (err) {
        console.error('Error creating manager:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

/**
 * Retrieve all teams managed by a specific manager.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.getTeamsByManager = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Manager ID is required' });
        }

        const teams = await managersModel.getTeamsByManager(id);
        if (teams.length === 0) {
            return res.status(404).json({ error: 'No teams found for this manager' });
        }

        res.status(200).json({ teams });
    } catch (err) {
        console.error('Error retrieving teams:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};


exports.createTeam = async (req, res) => {
    try {
        const managerId = parseInt(req.params.manager_id, 10);
        const { name, coach_id } = req.body;
        if (Number.isNaN(managerId) || !name || Number.isNaN(coach_id)) {
            return res.status(400).json({ error: 'manager_id, name and coach_id are required' });
        }

        const team = await managersModel.createTeam({ name, coach_id, manager_id: managerId });
        return res.status(201).json({ data: team });
    } catch (err) {
        console.error('Error creating team:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getCoachByTeam = async (req, res) => {
    try {
        const teamId = parseInt(req.params.team_id, 10);
        if (Number.isNaN(teamId)) {
            return res.status(400).json({ error: 'Invalid team ID' });
        }

        const coachId = await managersModel.getCoachByTeam(teamId);
        if (coachId == null) {
            return res.status(404).json({ error: 'Coach not found for this team' });
        }

        return res.status(200).json({ data: { coach_id: coachId } });
    } catch (err) {
        console.error('Error retrieving coach:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};