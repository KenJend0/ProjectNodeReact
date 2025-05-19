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
 * /api/managers:
 *   get:
 *     summary: List all managers
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A paginated list of managers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Manager'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     perPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       403:
 *         description: Access denied. Insufficient permissions.
 */
router.get('/', authMiddleware, roleMiddleware('manager'), managersController.listManagers);

/**
 * @swagger
 * /api/managers/{id}:
 *   get:
 *     summary: Retrieve a single manager by ID
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Manager ID
 *     responses:
 *       200:
 *         description: Manager data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Manager'
 *       400:
 *         description: Invalid manager ID
 *       404:
 *         description: Manager not found
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       403:
 *         description: Access denied. Insufficient permissions.
 */
router.get('/:id', authMiddleware, roleMiddleware('manager'), managersController.getManager);

/**
 * @swagger
 * /api/managers/{id}:
 *   put:
 *     summary: Update a manager’s profile
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Manager ID
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
 *               email:
 *                 type: string
 *                 example: jane.doe@example.com
 *               full_name:
 *                 type: string
 *                 example: Jane Doe Manager
 *     responses:
 *       200:
 *         description: Manager updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Manager'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Manager not found
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       403:
 *         description: Access denied. Insufficient permissions.
 */
router.put('/:id', authMiddleware, roleMiddleware('manager'), managersController.updateManager);

/**
 * @swagger
 * /api/managers/{id}:
 *   delete:
 *     summary: Delete a manager
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Manager ID
 *     responses:
 *       204:
 *         description: Manager deleted successfully
 *       400:
 *         description: Invalid manager ID
 *       404:
 *         description: Manager not found
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       403:
 *         description: Access denied. Insufficient permissions.
 */
router.delete('/:id', authMiddleware, roleMiddleware('manager'), managersController.deleteManager);

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
 *                 $ref: '#/components/schemas/Team'
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       403:
 *         description: Access denied. Insufficient permissions.
 */
router.get('/:id/teams', authMiddleware, roleMiddleware('manager'), managersController.getTeamsByManager);

/**
 * @swagger
 * /api/managers/{id}/teams:
 *   post:
 *     summary: Create a new team under a specific manager
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - coach_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pegasus
 *               coach_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       403:
 *         description: Access denied. Insufficient permissions.
 */
router.post('/:id/teams', authMiddleware, roleMiddleware('manager'), managersController.createTeam);

/**
 * @swagger
 * /api/managers/{id}/teams/{team_id}/coach:
 *   get:
 *     summary: Get the coach assigned to a specific team
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
 *       - in: path
 *         name: team_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the team
 *     responses:
 *       200:
 *         description: Successfully retrieved coach ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     coach_id:
 *                       type: integer
 *       400:
 *         description: Invalid manager or team ID
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       403:
 *         description: Access denied. Insufficient permissions.
 *       404:
 *         description: Coach not found for this team
 */
router.get('/:id/teams/:team_id/coach', authMiddleware, roleMiddleware('manager'), managersController.getCoachByTeam);
module.exports = router;
