const supabase = require('../config/db');
const axios = require('axios');

exports.getAllShipments = async (req, res) => {

    try {

        const { data: shipments, error } = await supabase
            .from('shipments')
            .select('*')
            .order('id_shipment');

        if (error) throw error;

        const detailedShipments = await Promise.all(
            shipments.map(async (s) => {

                try {

                    const [
                        sekolahRes,
                        dapurRes,
                        menuRes
                    ] = await Promise.all([

                        axios
                            .get(`${process.env.URL_SERVICE_SEKOLAH}/api/sekolah/${s.id_sekolah}`)
                            .catch(() => null),

                        axios
                            .get(`${process.env.URL_SERVICE_DAPUR}/api/dapur/${s.id_dapur}`)
                            .catch(() => null),

                        axios
                            .get(`${process.env.URL_SERVICE_MENU}/api/menu/${s.id_menu}`)
                            .catch(() => null)
                    ]);

                    return {
                        ...s,
                        nama_sekolah: sekolahRes?.data?.nama_sekolah || 'N/A',
                        nama_dapur: dapurRes?.data?.nama_dapur || 'N/A',
                        nama_menu: menuRes?.data?.nama_paket || 'N/A'
                    };

                } catch {

                    return {
                        ...s,
                        note: 'Beberapa data service tidak tersedia'
                    };
                }
            })
        );

        res.json(detailedShipments);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

exports.createShipment = async (req, res) => {

    try {

        const {
            id_sekolah,
            id_menu,
            id_dapur,
            jumlah_porsi,
            status,
            waktu_sampai
        } = req.body;

        const { data, error } = await supabase
            .from('shipments')
            .insert([
                {
                    id_sekolah,
                    id_menu,
                    id_dapur,
                    jumlah_porsi,
                    status_kirim: status,
                    waktu_sampai: waktu_sampai || null
                }
            ])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};

exports.updateShipment = async (req, res) => {

    try {

        const {
            id_sekolah,
            id_menu,
            id_dapur,
            jumlah_porsi,
            status,
            waktu_sampai
        } = req.body;

        const updateData = {
            id_sekolah,
            id_menu,
            id_dapur,
            jumlah_porsi,
            status_kirim: status,
            waktu_sampai:
                status === 'Diterima'
                    ? new Date()
                    : (waktu_sampai || null)
        };

        const { error } = await supabase
            .from('shipments')
            .update(updateData)
            .eq('id_shipment', req.params.id);

        if (error) throw error;

        res.json({
            message: 'Pengiriman berhasil diperbarui'
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};

exports.getShipmentById = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from('shipments')
            .select('*')
            .eq('id_shipment', req.params.id)
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

exports.deleteShipment = async (req, res) => {

    try {

        const { error } = await supabase
            .from('shipments')
            .delete()
            .eq('id_shipment', req.params.id);

        if (error) throw error;

        res.json({
            message: 'Data pengiriman dihapus'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};