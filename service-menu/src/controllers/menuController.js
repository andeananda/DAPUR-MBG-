const supabase = require('../config/db');
const axios = require('axios');


exports.getAllMenu = async (req, res) => {
    try {

        const { data, error } = await supabase
            .from('menus')
            .select(`
                *,
                menu_recipes(*)
            `);

        if (error) throw error;

        const invRes = await axios.get(
            'http://localhost:3004/api/inventory'
        );

        const inventoryList = invRes.data;

        const result = data.map(menu => {

            menu.menu_recipes = menu.menu_recipes.map(recipe => {

                const bahan = inventoryList.find(
                    i => i.id_inventory === recipe.id_inventory
                );

                return {
                    ...recipe,
                    nama_bahan: bahan?.nama_bahan || 'Unknown',
                    satuan: bahan?.satuan || ''
                };
            });

            return menu;
        });

        res.json(result);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};


exports.getMenuById = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from('menus')
            .select(`
                *,
                menu_recipes(*)
            `)
            .eq('id_menu', req.params.id)
            .single();

        if (error || !data) {
            return res.status(404).json({
                message: 'Menu tidak ditemukan'
            });
        }

        const invRes = await axios.get(
            'http://localhost:3004/api/inventory'
        );

        const inventoryList = invRes.data;

        data.menu_recipes = data.menu_recipes.map(recipe => {

            const bahan = inventoryList.find(
                i => i.id_inventory === recipe.id_inventory
            );

            return {
                ...recipe,
                nama_bahan: bahan?.nama_bahan || 'Unknown',
                satuan: bahan?.satuan || ''
            };
        });

        res.json(data);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};

exports.createMenu = async (req, res) => {

    try {

        const { MenuRecipes, ...menuData } = req.body;

        const { data: menu, error } = await supabase
            .from('menus')
            .insert([menuData])
            .select()
            .single();

        if (error) throw error;

        if (MenuRecipes?.length) {

            const recipes = MenuRecipes.map(item => ({
                id_menu: menu.id_menu,
                id_inventory: item.id_inventory,
                jumlah_kebutuhan: item.jumlah_kebutuhan
            }));

            await supabase
                .from('menu_recipes')
                .insert(recipes);
        }

        res.status(201).json({
            message: 'Menu & Resep berhasil dibuat',
            data: menu
        });

    } catch (err) {

        res.status(400).json({
            message: err.message
        });
    }
};

exports.getMenuKebutuhan = async (req, res) => {
    try {
        const { id, id_sekolah } = req.params;

        const menu = await Menu.findByPk(id);
        if (!menu) return res.status(404).json({ message: "Menu tidak ditemukan" });

        const sekolahRes = await axios.get(`http://localhost:3003/api/sekolah/${id_sekolah}`);
        const jumlahSiswa = sekolahRes.data.jumlah_siswa;

        res.json({
            id_menu: menu.id_menu,
            nama_menu: menu.nama_paket,
            sekolah: sekolahRes.data.nama_sekolah,
            total_porsi_target: jumlahSiswa,
            status: "Data sinkron dengan Service Sekolah"
        });
    } catch (err) {
        res.status(500).json({ 
            message: "Gagal sinkronisasi data sekolah. Pastikan Service Sekolah (Port 3003) jalan.",
            error: err.message 
        });
    }
};

exports.processProduction = async (req, res) => {
    try {
        const { id_menu, id_dapur, jumlah_porsi } = req.body;

        const { data: menu, error } = await supabase
        .from('menus')
        .select(`
            *,
            menu_recipes(*)
        `)
        .eq('id_menu', id_menu)
        .single();
        if (!menu) return res.status(404).json({ message: "Menu tidak ditemukan" });

        const kebutuhanBahan = menu.menu_recipes.map(r => ({
            id_inventory: r.id_inventory,
            total_kurangi: r.jumlah_kebutuhan * jumlah_porsi
        }));

        const invRes = await axios.post(`http://localhost:3004/api/inventory/reduce-bulk`, {
            id_dapur: id_dapur,
            items: kebutuhanBahan
        });

        res.json({
            message: "Produksi berhasil! Stok di Inventory telah terupdate.",
            log: invRes.data
        });
    } catch (err) {
        res.status(500).json({ 
            message: "Proses produksi gagal. Periksa stok bahan baku atau Service Inventory.",
            error: err.response?.data?.message || err.message 
        });
    }
};


exports.updateMenu = async (req, res) => {

    try {

        const { error } = await supabase
            .from('menus')
            .update(req.body)
            .eq('id_menu', req.params.id);

        if (error) throw error;

        res.json({
            message: 'Update menu berhasil'
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};

exports.deleteMenu = async (req, res) => {

    try {

        const { error } = await supabase
            .from('menus')
            .delete()
            .eq('id_menu', req.params.id);

        if (error) throw error;

        res.json({
            message: 'Menu dan Resep terkait berhasil dihapus'
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};