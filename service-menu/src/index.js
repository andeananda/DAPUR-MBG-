require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const menuRoutes = require('./routes/menuRoutes');

const app = express();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API MBG Barokah - Service Menu',
            version: '1.0.0',
            description: 'Dokumentasi API untuk Manajemen Paket Menu Makanan',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3002}`,
            },
        ],
    },
    apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/menu', menuRoutes);

app.get('/', (req, res) => {
    res.send('Service Menu sedang berjalan di port ' + process.env.PORT);
});

const PORT = process.env.PORT || 3002;

console.log('--------------------------------------------------');
console.log('Supabase Service Menu Aktif');
console.log(`Dokumentasi API: http://localhost:${PORT}/api-docs`);
console.log('--------------------------------------------------');

app.listen(PORT, () => {
    console.log(`Service Menu: http://localhost:${PORT}`);
});