const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

/**
 * @openapi
 * /api/menu:
 * get:
 * summary: Ambil semua daftar menu beserta resepnya
 * tags: [Menu]
 * post:
 * summary: Tambah paket menu baru (Bisa nested dengan MenuRecipes)
 * tags: [Menu]
 */
router.get('/', menuController.getAllMenu);
router.post('/', menuController.createMenu);

/**
 * @openapi
 * /api/menu/process-production:
 * post:
 * summary: Proses produksi makan siang (Otomatis potong stok di Inventory)
 * tags: [Menu]
 * requestBody:
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * id_menu: { type: integer }
 * id_dapur: { type: integer }
 * jumlah_porsi: { type: integer }
 */
router.post('/process-production', menuController.processProduction);

/**
 * @openapi
 * /api/menu/{id}/kebutuhan/{id_sekolah}:
 * get:
 * summary: Cek kebutuhan porsi menu untuk sekolah tertentu (API Aggregator)
 * tags: [Menu]
 */
router.get('/:id/kebutuhan/:id_sekolah', menuController.getMenuKebutuhan);

/**
 * @openapi
 * /api/menu/{id}:
 * get:
 * summary: Detail menu berdasarkan ID
 * tags: [Menu]
 * put:
 * summary: Update data menu
 * tags: [Menu]
 * delete:
 * summary: Hapus menu
 * tags: [Menu]
 */
router.get('/:id', menuController.getMenuById);
router.put('/:id', menuController.updateMenu);
router.delete('/:id', menuController.deleteMenu);

module.exports = router;