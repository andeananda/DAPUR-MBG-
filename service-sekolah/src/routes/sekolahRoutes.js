const express = require('express');
const router = express.Router();
const sekolahController = require('../controllers/sekolahController');

/**
 * @swagger
 * tags:
 * name: Sekolah
 * description: API untuk manajemen data sekolah (CRUD)
 */

/**
 * @swagger
 * /api/sekolah:
 * get:
 * summary: Ambil semua daftar sekolah
 * tags: [Sekolah]
 * responses:
 * 200:
 * description: Berhasil mengambil semua data sekolah
 * post:
 * summary: Tambah data sekolah baru
 * tags: [Sekolah]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * npsn:
 * type: string
 * nama_sekolah:
 * type: string
 * alamat_sekolah:
 * type: string
 * jenjang:
 * type: string
 * enum: [SD, SMP, SMA]
 * jumlah_siswa:
 * type: integer
 * responses:
 * 201:
 * description: Sekolah berhasil ditambahkan
 */
router.get('/', sekolahController.getAllSekolah);
router.post('/', sekolahController.createSekolah);

/**
 * @swagger
 * /api/sekolah/{id}:
 * get:
 * summary: Detail sekolah berdasarkan ID
 * tags: [Sekolah]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: ID Sekolah
 * responses:
 * 200:
 * description: Data sekolah ditemukan
 * 404:
 * description: Sekolah tidak ditemukan
 * put:
 * summary: Update data sekolah
 * tags: [Sekolah]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * nama_sekolah:
 * type: string
 * alamat_sekolah:
 * type: string
 * jumlah_siswa:
 * type: integer
 * responses:
 * 200:
 * description: Data sekolah berhasil diperbarui
 * delete:
 * summary: Hapus data sekolah
 * tags: [Sekolah]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Sekolah berhasil dihapus
 */
router.get('/:id', sekolahController.getSekolahById);
router.put('/:id', sekolahController.updateSekolah);
router.delete('/:id', sekolahController.deleteSekolah);

module.exports = router;