const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { fork } = require('child_process');

const app = express();
// Railway akan otomatis menentukan PORT publik di production, lokal default ke 8080
const PORT = process.env.PORT || 8080; 

// 1. DAFTAR MICROSERVICES & ALOKASI PORT INTERNAL
const services = [
    { name: 'service-dapur', path: './service-dapur/index.js', port: 3001 },
    { name: 'service-distribusi', path: './service-distribusi/index.js', port: 3002 },
    { name: 'service-inventory', path: './service-inventory/index.js', port: 3003 },
    { name: 'service-menu', path: './service-menu/index.js', port: 3004 },
    { name: 'service-sekolah', path: './service-sekolah/index.js', port: 3005 },
];

// Menjalankan semua sub-service di background menggunakan child_process.fork
services.forEach(service => {
    console.log(`[Gateway] Mengaktifkan ${service.name} pada port internal ${service.port}...`);
    fork(service.path, [], {
    env: { ...process.env, PORT: service.port } // Mengirimkan port unik ke setiap service
    });
});

// 2. REVERSE PROXY ROUTING
// Request dari frontend akan diteruskan secara utuh ke port internal yang sesuai
app.use('/api/dapur', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
app.use('/api/distribusi', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));
app.use('/api/inventory', createProxyMiddleware({ target: 'http://localhost:3003', changeOrigin: true }));
app.use('/api/menu', createProxyMiddleware({ target: 'http://localhost:3004', changeOrigin: true }));
app.use('/api/sekolah', createProxyMiddleware({ target: 'http://localhost:3005', changeOrigin: true }));

// Rute dasar untuk mengecek apakah Gateway aktif
app.get('/', (req, res) => {
    res.send('🚀 API Gateway MBG Barokah Monorepo aktif dan berjalan lancar!');
});

app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🟢 GATEWAY ONLINE: http://localhost:${PORT}`);
    console.log(`==================================================\n`);
});