const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PoloManager API',
            version: '1.0.0',
            description: 'API documentation for PoloManager backend',
        },
        servers: [
            {
                url: 'http://localhost:3000', // URL du serveur backend
            },
        ],
    },
    apis: ['./routes/*.js'], // Chemins vers les fichiers contenant les commentaires Swagger
};

module.exports = swaggerJsDoc(swaggerOptions);
