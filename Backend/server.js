const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swaggerConfig');

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all origins or a specific origin
app.use(cors({
    origin: 'http://localhost:3001' // Replace with the actual frontend origin
}));

// Swagger setup
const PORT = process.env.PORT || 3000;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);

// Test route
app.get('/test', (req, res) => {
    res.send('Server is working!');
});

// Import routes
const authRoutes = require('./routes/auth');
const coachRoutes = require('./routes/coachs');
const managerRoutes = require('./routes/managers');
const messageRoutes = require('./routes/messages');
const playerRoutes = require('./routes/players');
const scheduleRoutes = require('./routes/schedules');
const teamRoutes = require('./routes/teams');

// Register routes with prefixes
app.use('/api/auth', authRoutes);
app.use('/api/coachs', coachRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/teams', teamRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('PoloManager Backend is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
