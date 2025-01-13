const Cart = require('../models/Cart');

const attachOrCreateCartId = async (req, res, next) => {
    try {
        console.log('req.user in attachOrCreateCartId: ', req.user);
        const cart = await Cart.findOne({
            where: {
                user_id: req.user.id,
            },
        });
        console.log('cart in attachOrCreateCartId: ', cart.id);

        if (!cart) {
            const newCart = await Cart.create({
                user_id: req.user.id,
            });

            req.user.cart_id = newCart.id;
        } else {
            req.user.cart_id = cart.id;
        }

        console.log('req.user after attachOrCreateCartId:', req.user);
        next();
        return;
    } catch (error) {
        next(error); 
    }
};

module.exports = attachOrCreateCartId;