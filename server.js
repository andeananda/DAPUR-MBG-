const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { fork } = require('child_process');
const cors = require('cors');
const path = require('path'); // 👈 TAMBAHAN: Mengamankan path di server Linux Railway

const app = express();
const PORT = process.env.PORT || 8080; 

app.use(cors({
    origin: 'https://dapur-mbg-nu.vercel.app',
    credentials: true
}));

// 1. DAFTAR MICROSERVICES & ALOKASI PORT INTERNAL (Menggunakan path.join absolut)
const services = [
    { name: 'service-dapur', path: path.join(__dirname, 'service-dapur', 'index.js'), port: 3001 },
    { name: 'service-distribusi', path: path.join(__dirname, 'service-distribusi', 'index.js'), port: 3002 },
    { name: 'service-inventory', path: path.join(__dirname, 'service-inventory', 'index.js'), port: 3003 },
    { name: 'service-menu', path: path.join(__dirname, 'service-menu', 'index.js'), port: 3004 },
    { name: 'service-sekolah', path: path.join(__dirname, 'service-sekolah', 'index.js'), port: 3005 },
];

// Menjalankan semua sub-service di background menggunakan child_process.fork
services.forEach(service => {
    console.log(`[Gateway] Mengaktifkan ${service.name} pada port internal ${service.port}...`);
    
    const child = fork(service.path, [], {
        env: { ...process.env, PORT: service.port } // Mengirimkan port unik ke setiap service
    });

    // 👇 TAMBAHAN CCTV: Menangkap pesan error spesifik jika microservice gagal/crash
    child.on('error', (err) => {
        console.error(`❌ [${service.name}] Gagal dijalankan:`, err.message);
    });

    child.on('exit', (code) => {
        if (code !== 0 && code !== null) {
            console.error(`❌ [${service.name}] Mati secara tidak wajar dengan Exit Code: ${code}`);
        }
    });
});

// 2. REVERSE PROXY ROUTING (Menggunakan IP 127.0.0.1 agar stabil di Cloud)
app.use('/api/dapur', createProxyMiddleware({ target: 'http://127.0.0.1:3001', changeOrigin: true }));
app.use('/api/distribusi', createProxyMiddleware({ target: 'http://127.0.0.1:3002', changeOrigin: true }));
app.use('/api/inventory', createProxyMiddleware({ target: 'http://127.0.0.1:3003', changeOrigin: true }));
app.use('/api/menu', createProxyMiddleware({ target: 'http://127.0.0.1:3004', changeOrigin: true }));
app.use('/api/sekolah', createProxyMiddleware({ target: 'http://127.0.0.1:3005', changeOrigin: true }));

// Rute dasar untuk mengecek apakah Gateway aktif
app.get('/', (req, res) => {
    res.send('🚀 API Gateway MBG Barokah Monorepo aktif dan berjalan lancar!');
});

app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🟢 GATEWAY ONLINE: http://127.0.0.1:${PORT}`);
    console.log(`==================================================\n`);
});