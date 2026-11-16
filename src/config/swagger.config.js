import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de ShipNow API',
            version: '1.0.0',
            description: 'API profesional construida con Node.js, Express, MongoDB, arquitectura en capas, manejo centralizado de errores y logging con Winston para gestión logística y envíos.',
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Servidor local de desarrollo',
            },
        ],
    },
    apis: ['./src/docs/**/*.yaml', './src/routes/**/*.js'],
};

export const specs = swaggerJSDoc(swaggerOptions);