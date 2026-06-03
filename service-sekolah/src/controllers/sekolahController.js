const supabase = require('../config/db');

exports.getAllSekolah = async (req, res) => {
    try {

        const { data, error } = await supabase
            .from('sekolahs')
            .select('*')
            .order('id_sekolah');

        if (error) throw error;

        res.json(data);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

exports.getSekolahById = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from('sekolahs')
            .select('*')
            .eq('id_sekolah', req.params.id)
            .single();

        if (error) {
            return res.status(404).json({
                message: 'Sekolah tidak ditemukan'
            });
        }

        res.json(data);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};

exports.createSekolah = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from('sekolahs')
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

exports.updateSekolah = async (req, res) => {

    try {

        const { error } = await supabase
            .from('sekolahs')
            .update(req.body)
            .eq('id_sekolah', req.params.id);

        if (error) {
            return res.status(404).json({
                message: 'Sekolah tidak ditemukan'
            });
        }

        res.json({
            message: 'Data sekolah diupdate'
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};

exports.deleteSekolah = async (req, res) => {

    try {

        const { error } = await supabase
            .from('sekolahs')
            .delete()
            .eq('id_sekolah', req.params.id);

        if (error) throw error;

        res.json({
            message: 'Sekolah dihapus'
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};