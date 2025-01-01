const Voucher = require('../../models/Voucher');
const Seller = require('../../models/Seller');
const Sequelize = require('sequelize');

// Create and Save a new Voucher
// POST /api/seller/voucher/add
let createVoucher = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: "Content can not be empty!"
            });
        }
        const id = req.user.id;
        const seller = await Seller.findOne({
            where: {
                user_id: id
            },
            attributes: ['store_id']
        });

        const storeId = seller.store_id;
        req.body.store_id = storeId;

        // // Check if product is not belong to the store
        // if (!req.body.product_id) {
        //     const result = await Product.findOne({
        //         where: {
        //             id: req.body.product_id,
        //             store_id: storeId
        //         }
        //     });

        //     if (!result) {
        //         return res.status(404).json({
        //             message: `Cannot create Voucher. Product with id=${req.body.product_id} was not found in your store!`
        //         });
        //     }
        // }
        
        const voucherData = req.body;
        console.log(voucherData);
        const newVoucher = await Voucher.create(voucherData);

        res.status(201).json({
            message: "Voucher was created successfully!",
            voucher: newVoucher,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error while adding voucher',
            error: error.message
        });
    }
}


// Delete a voucher
// DELETE /api/seller/voucher/delete/:id
let deleteVoucher = async (req, res) => {
    try {
        const id = req.params.id;

        const userId = req.user.id;
        const seller = await Seller.findOne({
            where: {
                user_id: userId
            }
        });
        const storeId = seller.store_id;
        const result = await Voucher.findOne({
            where: {
                id: id,
                store_id: storeId
            }
        });

        if (!result) {
            return res.status(404).json({
                message: `Cannot delete Voucher with id=${id}. Maybe Voucher was not found!`
            });
        }

        const voucher = await Voucher.destroy({
            where: { id: id }
        });
        if (voucher == 1) {
            res.status(200).json({
                message: "Voucher was deleted successfully!",
            });
        } else {
            res.status(404).json({
                message: `Cannot delete Voucher with id=${id}. Maybe Voucher was not found!`,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error while deleting voucher',
            error: error.message
        });
    }
}

// Retrieve all Vouchers from the database.
// GET /api/seller/vouchers
let getAllVouchers = async (req, res) => {
    try {
        const id = req.user.id;
        const seller = await Seller.findOne({
            where: {
                user_id: id
            }
        });
        const storeId = seller.store_id;

        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const offset = (page - 1) * limit;

        const vouchers = await Voucher.findAll({
            where: {
                store_id : storeId
            },
            limit: limit,
            offset: offset,
        });

        const totalVouchers = await Voucher.count({
            where: { store_id : storeId }
        });
        res.status(200).json({
            message: "Vouchers retrieved successfully!",
            vouchers: vouchers,
            totalItems: totalVouchers,
            limit: limit,
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error while retrieving vouchers',
            error: error.message
        });
    }
}


// Get a single Voucher by id
// GET /api/seller/voucher/:id
let getVoucherById = async (req, res) => {
    try {
        const id = req.params.id;
        const voucher = await Voucher.findByPk(id);
        if (voucher) {
            res.status(200).json({
                message: "Voucher retrieved successfully!",
                voucher: voucher,
            });
        } else {
            res.status(404).json({
                message: `Voucher with id=${id} was not found!`,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error while retrieving voucher',
            error: error.message
        });
    }
}

// Update a Voucher by the id in the request
// PUT /api/seller/voucher/update/:id
let updateVoucher = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        const seller = await Seller.findOne({
            where: {
                user_id: userId
            }
        });
        const storeId = seller.store_id;

        const result = await Voucher.findOne({
            where: {
                id: id,
                store_id: storeId
            }
        });

        if (!result) {
            return res.status(404).json({
                message: `Cannot update Voucher with id=${id}. Maybe Voucher was not found!`
            });
        }

        const voucherData = req.body;
        const voucher = await Voucher.update(voucherData, {
            where: { id: id }
        });
        if (voucher == 1) {
            res.status(200).json({
                message: "Voucher was updated successfully!",
            });
        } else {
            res.status(404).json({
                message: `Cannot update Voucher with id=${id}. Maybe Voucher was not found or req.body is empty!`,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error while updating voucher',
            error: error.message
        });
    }
}

module.exports = {
    createVoucher,
    deleteVoucher,
    getAllVouchers,
    getVoucherById,
    updateVoucher
}