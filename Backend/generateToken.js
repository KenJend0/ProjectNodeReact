const jwt = require('jsonwebtoken');

// Replace with your environment variable or secret key
const secretKey = process.env.JWT_SECRET || 'MySuperSecretKey123!@';

// Generate a JWT token
const token = jwt.sign(
    { id: 1, role: 'manager', team_id: 1 },
    secretKey, // Use your environment variable for the secret key
    { expiresIn: '1h' }
);

console.log('Generated Token:', token);

try {
    // Decode and verify the token
    const decodedToken = jwt.verify(token, secretKey);
    console.log('Decoded Token:', decodedToken);
    console.log('Team ID:', decodedToken.team_id); // Additional verification
} catch (err) {
    console.error('Error decoding token:', err.message);
}
