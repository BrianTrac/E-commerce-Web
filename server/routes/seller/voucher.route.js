const express = require('express');
const router = express.Router();
const voucherController = require('../../controllers/seller/voucher.controller');

// Create a new Voucher
router.post('/add', voucherController.createVoucher);

// Delete a Voucher with id
router.delete('/delete/:id', voucherController.deleteVoucher);

// Retrieve all Vouchers
router.get('/', voucherController.getAllVouchers);

// Retrieve a single Voucher by id
router.get('/:id', voucherController.getVoucherById);

// Update a Voucher with id
router.put('/update/:id', voucherController.updateVoucher);

module.exports = router;