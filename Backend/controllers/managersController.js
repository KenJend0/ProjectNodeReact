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
