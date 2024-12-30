const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Routes related to sending and receiving messages
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiver_id:
 *                 type: integer
 *                 example: 2
 *               content:
 *                 type: string
 *                 example: Hello, how are you?
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Bad request. Missing fields.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.post('/', authMiddleware, messagesController.sendMessage);

/**
 * @swagger
 * /api/messages/received:
 *   get:
 *     summary: Get all received messages for the authenticated user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved received messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   sender_id:
 *                     type: integer
 *                   message:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *                   sender_name:
 *                     type: string
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.get('/received', authMiddleware, messagesController.getReceivedMessages);

/**
 * @swagger
 * /api/messages/sent:
 *   get:
 *     summary: Get all sent messages for the authenticated user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved sent messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   receiver_id:
 *                     type: integer
 *                   message:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *                   receiver_name:
 *                     type: string
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.get('/sent', authMiddleware, messagesController.getSentMessages);

/**
 * @swagger
 * /api/messages/contacts:
 *   get:
 *     summary: Get the contact list for the authenticated user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved contacts
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
 *                   role:
 *                     type: string
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.get('/contacts', authMiddleware, messagesController.getContacts);

module.exports = router;
