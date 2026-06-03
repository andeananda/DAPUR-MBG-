const express = require('express');
const router = express.Router();
const dapurController = require('../controllers/dapurController');

/**
 * @openapi
 * /api/dapur:
 * get:
 * summary: Ambil semua daftar dapur
 * tags: [Dapur]
 * post:
 * summary: Registrasi dapur baru
 * tags: [Dapur]
 * requestBody:
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * nama_dapur: { type: string }
 * lokasi: { type: string }
 * kapasitas_porsi: { type: integer }
 */
router.get('/', dapurController.getAllDapur);
router.post('/', dapurController.createDapur);

/**
 * @openapi
 * /api/dapur/{id}:
 * get:
 * summary: Detail dapur berdasarkan ID
 * tags: [Dapur]
 * put:
 * summary: Update data dapur
 * tags: [Dapur]
 * delete:
 * summary: Hapus data dapur
 * tags: [Dapur]
 */
router.get('/:id', dapurController.getDapurById);
router.put('/:id', dapurController.updateDapur);
router.delete('/:id', dapurController.deleteDapur);

module.exports = router;