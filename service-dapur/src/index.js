require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const dapurRoutes = require('./routes/dapurRoutes');

const app = express();

const PORT = process.env.PORT || 3001; 

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API MBG Barokah - Service Dapur',
            version: '1.0.0',
            description: 'Dokumentasi API untuk Manajemen Operasional Dapur',
        },
        servers: [{ url: `http://localhost:${PORT}` }],
    },
    apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/dapur', dapurRoutes);

app.get('/', (req, res) => {
    res.send(`🚀 Service Dapur berjalan di port ${PORT}`);
});

console.log('--------------------------------------------------');
console.log('✅ Supabase Service Dapur Aktif');
console.log(`📖 Swagger: http://localhost:${PORT}/api-docs`);
console.log('--------------------------------------------------');

app.listen(PORT, () => {
    console.log(`🚀 Server on port: ${PORT}`);
});