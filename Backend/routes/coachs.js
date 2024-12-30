const express = require('express');
const router = express.Router();
const coachsController = require('../controllers/coachsController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Coachs
 *   description: Routes related to managing coaches
 */

/**
 * @swagger
 * /api/coachs:
 *   post:
 *     summary: Create a new coach
 *     tags: [Coachs]
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
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: jane.doe@example.com
 *               team_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Coach created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Coach created successfully
 *                 coach:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                 temporaryPassword:
 *                   type: string
 *                   example: randompassword123
 *       403:
 *         description: Access denied. Insufficient permissions.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.post('/', authMiddleware, roleMiddleware('manager'), coachsController.createCoach);

module.exports = router;
