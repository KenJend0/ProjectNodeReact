const scheduleModel = require('../models/schedulesModel');

/**
 * Get schedules for a specific team.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.getSchedulesByTeam = async (req, res) => {
    try {
        const { team_id } = req.query;

        if (!team_id) {
            return res.status(400).json({ error: 'Team ID is required' });
        }

        const schedules = await scheduleModel.getSchedulesByTeam(team_id);
        res.status(200).json(schedules);
    } catch (err) {
        console.error('Error fetching schedules:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Add a new schedule for a team.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.addSchedule = async (req, res) => {
    console.log('Request body:', req.body);

    const { event_type, event_date, start_time, end_time, location, description, team_id } = req.body;

    if (!event_type || !event_date || !start_time || !end_time || !location || !team_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const newSchedule = await scheduleModel.addSchedule({
            event_type,
            event_date,
            start_time,
            end_time,
            location,
            description,
            team_id,
        });

        res.status(201).json({
            message: 'Schedule added successfully',
            schedule: newSchedule,
        });
    } catch (err) {
        console.error('Error adding schedule:', err.message);
        res.status(500).json({ error: 'Failed to add schedule' });
    }
};

/**
 * Update an existing schedule by ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Schedule ID is required' });
        }

        const updatedSchedule = await scheduleModel.updateSchedule(id, req.body);

        if (!updatedSchedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        res.status(200).json({
            message: 'Schedule updated successfully',
            schedule: updatedSchedule,
        });
    } catch (err) {
        console.error('Error updating schedule:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Delete a schedule by ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Schedule ID is required' });
        }

        const deletedSchedule = await scheduleModel.deleteSchedule(id);

        if (!deletedSchedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        res.status(200).json({
            message: 'Schedule deleted successfully',
            schedule: deletedSchedule,
        });
    } catch (err) {
        console.error('Error deleting schedule:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
