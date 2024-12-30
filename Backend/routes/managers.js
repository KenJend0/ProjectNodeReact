const express = require('express');
const router = express.Router();
const managersController = require('../controllers/managersController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Managers
 *   description: Routes related to managing managers and their teams
 */

/**
 * @swagger
 * /api/managers:
 *   post:
 *     summary: Create a new manager
 *     tags: [Managers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Smith
 *               email:
 *                 type: string
 *                 example: john.smith@example.com
 *     responses:
 *       201:
 *         description: Manager created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: John Smith
 *                 email:
 *                   type: string
 *                   example: john.smith@example.com
 *       400:
 *         description: Bad request. Invalid input data.
 */
router.post('/', managersController.createManager);

/**
 * @swagger
 * /api/managers/{id}/teams:
 *   get:
 *     summary: Get all teams managed by a specific manager
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the manager
 *     responses:
 *       200:
 *         description: Successfully retrieved teams
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
 *       403:
 *         description: Access denied. Insufficient permissions.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.get('/:id/teams', authMiddleware, roleMiddleware('manager'), managersController.getTeamsByManager);

module.exports = router;
