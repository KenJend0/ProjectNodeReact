const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedulesController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: Routes related to managing schedules for teams
 */

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Get schedules for a specific team
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: team_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the team
 *     responses:
 *       200:
 *         description: Successfully retrieved schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   event_type:
 *                     type: string
 *                   event_date:
 *                     type: string
 *                   start_time:
 *                     type: string
 *                   end_time:
 *                     type: string
 *                   location:
 *                     type: string
 *                   description:
 *                     type: string
 *       400:
 *         description: Bad request. Missing team ID.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.get('/', authMiddleware, scheduleController.getSchedulesByTeam);

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Add a new schedule
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_type:
 *                 type: string
 *                 example: Training
 *               event_date:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-01
 *               start_time:
 *                 type: string
 *                 format: time
 *                 example: 10:00:00
 *               end_time:
 *                 type: string
 *                 format: time
 *                 example: 12:00:00
 *               location:
 *                 type: string
 *                 example: Stadium A
 *               description:
 *                 type: string
 *                 example: Weekly training session
 *               team_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *       400:
 *         description: Bad request. Missing fields.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.post('/', authMiddleware, scheduleController.addSchedule);

/**
 * @swagger
 * /api/schedules/{id}:
 *   put:
 *     summary: Update an existing schedule
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the schedule to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_type:
 *                 type: string
 *                 example: Training
 *               event_date:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-01
 *               start_time:
 *                 type: string
 *                 format: time
 *                 example: 10:00:00
 *               end_time:
 *                 type: string
 *                 format: time
 *                 example: 12:00:00
 *               location:
 *                 type: string
 *                 example: Stadium A
 *               description:
 *                 type: string
 *                 example: Updated weekly training session
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       404:
 *         description: Schedule not found
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.put('/:id', authMiddleware, scheduleController.updateSchedule);

/**
 * @swagger
 * /api/schedules/{id}:
 *   delete:
 *     summary: Delete a schedule by ID
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the schedule to delete
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *       404:
 *         description: Schedule not found
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.delete('/:id', authMiddleware, scheduleController.deleteSchedule);

module.exports = router;
