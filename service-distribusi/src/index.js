require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const shipmentRoutes = require('./routes/shipmentRoutes');

const app = express();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API MBG Barokah - Service Distribusi',
            version: '1.0.0',
            description: 'Dokumentasi API Monitoring Pengiriman (Microservices Aggregator)',
        },
        servers: [{ url: `http://localhost:${process.env.PORT || 3005}` }],
    },
    apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/distribusi', shipmentRoutes);

const PORT = process.env.PORT || 3005;

console.log('--------------------------------------------------');
console.log('✅ Supabase Service Distribusi Aktif');
console.log(`📖 Swagger: http://localhost:${PORT}/api-docs`);
console.log('--------------------------------------------------');

app.listen(PORT, () => {
    console.log(`🚀 Server on port: ${PORT}`);
});