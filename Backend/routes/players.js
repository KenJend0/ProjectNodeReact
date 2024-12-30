const express = require('express');
const router = express.Router();
const playersController = require('../controllers/playersController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Players
 *   description: Routes related to player management
 */

/**
 * @swagger
 * /api/players:
 *   post:
 *     summary: Add a new player
 *     tags: [Players]
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
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               position:
 *                 type: string
 *                 example: Forward
 *               team_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Player added successfully
 *       400:
 *         description: Bad request. Missing fields.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.post('/', authMiddleware, playersController.addPlayer);

/**
 * @swagger
 * /api/players/{id}/stats:
 *   get:
 *     summary: Get stats for a specific player
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the player
 *     responses:
 *       200:
 *         description: Successfully retrieved player stats
 *       404:
 *         description: Player not found
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.get('/:id/stats', authMiddleware, playersController.getPlayerStats);

/**
 * @swagger
 * /api/players/{id}:
 *   delete:
 *     summary: Delete a player
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the player to delete
 *     responses:
 *       200:
 *         description: Player deleted successfully
 *       404:
 *         description: Player not found
 *       403:
 *         description: Access denied. Insufficient permissions.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.delete('/:id', authMiddleware, roleMiddleware('coach', 'manager'), playersController.deletePlayer);

/**
 * @swagger
 * /api/players/{id}:
 *   put:
 *     summary: Update a player's information
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the player to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               position:
 *                 type: string
 *                 example: Midfielder
 *               buts:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Player updated successfully
 *       404:
 *         description: Player not found
 *       403:
 *         description: Access denied. Insufficient permissions.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.put('/:id', authMiddleware, roleMiddleware('coach', 'manager'), playersController.updatePlayer);

/**
 * @swagger
 * /api/players:
 *   get:
 *     summary: Get all players for the authenticated user's team
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved players
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
 *                   position:
 *                     type: string
 *                   buts:
 *                     type: integer
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.get('/', authMiddleware, playersController.getPlayersByTeam);

/**
 * @swagger
 * /api/players/api/players:
 *   get:
 *     summary: Get players by team ID
 *     tags: [Players]
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
 *         description: Successfully retrieved players
 *       400:
 *         description: Bad request. Missing team ID.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.get('/api/players', authMiddleware, roleMiddleware('coach'), async (req, res) => {
    try {
        const team_id = req.query.team_id;

        if (!team_id) {
            return res.status(400).json({ error: 'Team ID is required.' });
        }

        const players = await playersController.getPlayersByTeam(team_id);
        res.status(200).json(players);
    } catch (error) {
        console.error('Error fetching players:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
