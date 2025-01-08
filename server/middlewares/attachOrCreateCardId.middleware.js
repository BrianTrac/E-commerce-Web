const Cart = require('../models/Cart');

const attachOrCreateCartId = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({
            where: {
                user_id: req.user.id,
            },
        });

        if (!cart) {
            const newCart = await Cart.create({
                user_id: req.user.id,
            });

            req.user.cart_id = newCart.id;
        } else {
            req.user.cart_id = cart.id;
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

module.exports = attachOrCreateCartId;