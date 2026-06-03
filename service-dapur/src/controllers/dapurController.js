const supabase = require('../config/db');

exports.getAllDapur = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from('dapurs')
            .select('*')
            .order('id_dapur');

        if (error) throw error;

        res.json(data);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};

exports.getDapurById = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from('dapurs')
            .select('*')
            .eq('id_dapur', req.params.id)
            .single();

        if (error || !data) {
            return res.status(404).json({
                message: 'Dapur tidak ditemukan'
            });
        }

        res.json(data);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};

exports.createDapur = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from('dapurs')
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

exports.updateDapur = async (req, res) => {

    try {

        const { error } = await supabase
            .from('dapurs')
            .update(req.body)
            .eq('id_dapur', req.params.id);

        if (error) {
            return res.status(404).json({
                message: 'Dapur tidak ditemukan'
            });
        }

        res.json({
            message: 'Dapur berhasil diupdate'
        });

    } catch (err) {

        res.status(400).json({
            message: err.message
        });
    }
};

exports.deleteDapur = async (req, res) => {

    try {

        const { error } = await supabase
            .from('dapurs')
            .delete()
            .eq('id_dapur', req.params.id);

        if (error) {
            return res.status(404).json({
                message: 'Dapur tidak ditemukan'
            });
        }

        res.json({
            message: 'Dapur berhasil dihapus'
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};