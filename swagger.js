// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Mooveit',
      version: '1.0.0',
      description: 'Documentation automatique des endpoints API de Mooveit',
    },
  },
  apis: ['./routes/*.js'], // ou adapte selon tes routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
