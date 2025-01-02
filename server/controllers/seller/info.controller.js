const Seller = require('../../models/Seller');
const Product = require('../../models/Product');
const SellerInfo = require('../../models/SellerInfo');
const User = require('../../models/User');

const getSellerInfo = async (req, res) => {
    try {
        const seller_id = req.user?.id || 11;

        let sellerInfo = await SellerInfo.findOne({
            where: {
                user_id: seller_id
            }
        });

        if (!sellerInfo) {
            // Mếu k có thì bắt đầu tạo mới
            sellerInfo = await SellerInfo.create({
                user_id: seller_id,
            });
        }

        const sellerAuth = await User.findByPk(seller_id);

        if (!sellerAuth) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Thêm thuộc tính username và email vào sellerInfo
        const fullSellerInfo = {
            ...sellerInfo.toJSON(),
            username: sellerAuth?.username,
            email: sellerAuth?.email,
        };

        res.status(200).json(fullSellerInfo);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createSellerInfo = async (req, res) => {
    try {
        const id = req.user?.id || 11;

        const seller = await Seller.findOne({
            where: {
                user_id: id
            }
        });

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        const sellerInfo = await SellerInfo.create({
            seller_id: seller.id,
            store_id: seller.store_id,
            ...req.body,
            user_id: id,
        });

        res.status(201).json(sellerInfo);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateSellerInfo = async (req, res) => {
    try {
        const id = req.user?.id || 11;

        const sellerInfo = await SellerInfo.findOne({
            where: {
                user_id: id
            }
        });

        if (!sellerInfo) {
            return res.status(404).json({ message: 'Seller info not found' });
        }

        await sellerInfo.update(req.body);

        res.status(200).json({ message: 'Seller info updated' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getSellerInfo,
    createSellerInfo,
    updateSellerInfo
};