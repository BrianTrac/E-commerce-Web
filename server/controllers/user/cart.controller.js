const Product = require('../../models/Product');
const CartItems = require('../../models/CartItems');
const Cart = require('../../models/Cart');
const { QueryTypes, Op } = require('sequelize');
const sequelize = require('../../config/db');

const getCartItems = async (req, res) => {
    try {
        // check if cart does not exist for the user and create one
        //console.log('req.user in getCartItems: ', req.user);
        
        const cart = await Cart.findOne({
            where: {
                user_id: req.user.id,
            },
        });
        console.log("CHECK2: ", res.headersSent);
        
        if (!cart) {
            console.log('Creating cart for user: ', req.user.id);
            _= await Cart.create({
                user_id: req.user.id,
            });
        }
        //console.log('cart in getCartItems: ', cart.id);
        // if (!req.user.cart_id) {
        //     req.user.cart_id = cart.id;
        // }

        console.log('req.user2 in getCartItems: ', req.user);
        const cartItems = await CartItems.findAll({
            where: {
                cart_id: req.user.cart_id,
                is_deleted: false,
            },
            include: {
                model: Product,
                as: 'product',
                required: true,
            },
            order: [
                ['created_at', 'DESC'],
            ],
        });

    //    console.log('cartItems: ', cartItems);

        return res.status(200).json({
            success: true,
            cartItems,
        });
    } catch (error) {
        // Only send error response if no response has been sent yet
        if (!res.headersSent) {
            return res.status(501).json({
                success: false,
                message: error.message,
            });
        }
    }
};

const addToCartItem = async (req, res) => {
    const { itemId, quantity, selected } = req.body;

    console.log('itemId: ', itemId);
    console.log('quantity: ', quantity);
    console.log('user: ', req.user);
    try {
        const cartItem = await CartItems.findOne({
            where: {
                cart_id: req.user.cart_id,
                product_id: itemId,
                is_deleted: false,
            },
        });

        // Find the length of the cart
        let length = 0;
        const cartItems = await CartItems.findAll({
            where: {
                cart_id: req.user.cart_id,
                is_deleted: false,
            },
        });

        if (cartItems) {
            length = cartItems.length;
        }

        // If item not found in cart, add it
        if (!cartItem) {
            const newCartItem = await CartItems.create({
                cart_id: req.user.cart_id,
                product_id: itemId,
                quantity,
            });

            return res.status(200).json({
                success: true,
                cartItem: newCartItem,
                length: length + 1,
            });
        }

        cartItem.quantity += quantity;
        await cartItem.save();

        return res.status(200).json({
            success: true,
            cartItem,
            length,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateCartItem = async (req, res) => {
    const { itemId } = req.params;
    const { quantity, selected } = req.body;
    console.log('itemId: ', itemId);
    try {
        const cartItem = await CartItems.findOne({
            where: {
                cart_id: req.user.cart_id,
                product_id: itemId,
                is_deleted: false,
            },
        });

        // If item not found in cart, add it
        if (!cartItem) {
            const newCartItem = await CartItems.create({
                cart_id: req.user.cart_id,
                product_id: itemId,
                quantity,
                selected: true,
            });

            return res.status(200).json({
                success: true,
                cartItem: newCartItem,
            });
        }

        cartItem.quantity = quantity;
        cartItem.selected = selected;
        await cartItem.save();

        return res.status(200).json({
            success: true,
            cartItem,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteCartItem = async (req, res) => {
    const { itemIds } = req.body;

    const parsedItemIds = itemIds.map((id) => parseInt(id, 10));

    try {
        await CartItems.update({
            is_deleted: true,
        }, {
            where: {
                cart_id: req.user.cart_id,
                product_id: {
                    [Op.in]: parsedItemIds,
                },
            }
        })

        return res.status(200).json({
            success: true,
            message: 'Items removed from cart',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getCartSummary = async (req, res) => {
    try {
        const cartSummary = await sequelize.query(`
            SELECT 
                SUM(ci.quantity) as total_items,
                SUM(ci.quantity * p.price) as total_price
            FROM cart_items ci
            JOIN product p ON ci.product_id = p.id
            WHERE ci.cart_id = ${req.user.cart_id}
            AND ci.is_deleted = false 
            AND ci.selected = true
        `, {
            type: QueryTypes.SELECT,
        });

        return res.status(200).json({
            success: true,
            cartSummary: cartSummary[0],
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    addToCartItem,
    getCartItems,
    updateCartItem,
    deleteCartItem,
    getCartSummary,
};