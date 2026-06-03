const supabase = require('../config/db');

exports.getAllInventory = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from('inventories')
            .select('*')
            .order('id_inventory');

        if (error) throw error;

        res.json(data);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};

exports.getInventoryByDapur = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from('inventories')
            .select('*')
            .eq('id_dapur', req.params.id_dapur);

        if (error) throw error;

        res.json(data);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};

exports.getInventoryById = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from('inventories')
            .select('*')
            .eq('id_inventory', req.params.id)
            .single();

        if (error || !data) {
            return res.status(404).json({
                message: 'Data tidak ditemukan'
            });
        }

        res.json(data);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};

exports.reduceBulkStock = async (req, res) => {

    try {

        const { id_dapur, items } = req.body;

        for (const item of bahan) {

            const { data: inventory, error } = await supabase
                .from('inventories')
                .select('*')
                .eq('id_inventory', item.id_inventory)
                .eq('id_dapur', id_dapur)
                .single();

            if (error || !inventory) {
                continue;
            }

            const stokBaru =
                parseFloat(inventory.stok) -
                parseFloat(item.total_kurangi);

            await supabase
                .from('inventories')
                .update({
                    stok: stokBaru
                })
                .eq('id_inventory', item.id_inventory);
        }

        res.json({
            message: 'Stok berhasil diperbarui'
        });

    } catch (err) {

        res.status(500).json({
            message: 'Gagal update stok',
            error: err.message
        });
    }
};

exports.createInventory = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from('inventories')
            .insert([req.body])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);

    } catch (err) {

        res.status(400).json({
            message: err.message
        });
    }
};

exports.updateInventory = async (req, res) => {

    try {

        const { error } = await supabase
            .from('inventories')
            .update(req.body)
            .eq('id_inventory', req.params.id);

        if (error) throw error;

        res.json({
            message: 'Stok diupdate'
        });

    } catch (err) {

        res.status(400).json({
            message: err.message
        });
    }
};

exports.deleteInventory = async (req, res) => {

    try {

        const { error } = await supabase
            .from('inventories')
            .delete()
            .eq('id_inventory', req.params.id);

        if (error) throw error;

        res.json({
            message: 'Bahan baku dihapus'
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};