const express = require('express');
const router = express.Router();
const teamsController = require('../controllers/teamsController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const playersController = require('../controllers/playersController');
const schedulesController = require('../controllers/schedulesController');

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: Routes related to managing teams
 */

/**
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Team A
 *               coach_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Team created successfully
 *       403:
 *         description: Access denied. Insufficient permissions.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.post('/', authMiddleware, roleMiddleware('manager'), teamsController.createTeam);

/**
 * @swagger
 * /api/teams/{id}:
 *   get:
 *     summary: Get details of a specific team by ID
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the team
 *     responses:
 *       200:
 *         description: Successfully retrieved team details
 *       404:
 *         description: Team not found
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.get('/:id', authMiddleware, teamsController.getTeamDetails);

/**
 * @swagger
 * /api/teams/{id}/players:
 *   get:
 *     summary: Get all players of a specific team by ID
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the team
 *     responses:
 *       200:
 *         description: Successfully retrieved players
 *       404:
 *         description: Team not found
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.get('/:id/players', authMiddleware, playersController.getPlayersByTeam);

/**
 * @swagger
 * /api/teams/{id}:
 *   put:
 *     summary: Update a specific team by ID
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the team to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Team A
 *               coach_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Team updated successfully
 *       404:
 *         description: Team not found
 *       403:
 *         description: Access denied. Insufficient permissions.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.put('/:id', authMiddleware, roleMiddleware('manager'), teamsController.updateTeam);

/**
 * @swagger
 * /api/teams/{id}:
 *   delete:
 *     summary: Delete a specific team by ID
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the team to delete
 *     responses:
 *       200:
 *         description: Team deleted successfully
 *       404:
 *         description: Team not found
 *       403:
 *         description: Access denied. Insufficient permissions.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.delete('/:id', authMiddleware, roleMiddleware('manager'), teamsController.deleteTeam);

/**
 * @swagger
 * /api/teams/{id}/schedules:
 *   get:
 *     summary: Get all schedules of a specific team by ID
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the team
 *     responses:
 *       200:
 *         description: Successfully retrieved schedules
 *       404:
 *         description: Team not found
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.get('/:id/schedules', authMiddleware, schedulesController.getSchedulesByTeam);

/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: Get all teams
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all teams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   coach_id:
 *                     type: integer
 *                   manager_id:
 *                     type: integer
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.get('/', authMiddleware, teamsController.getAllTeams);

module.exports = router;
