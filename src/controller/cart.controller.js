const cartService = require('../services/cart.service.js');

const findUserCart = async (req, res) => {
    try {
        const cart = await cartService.findUserCart(req.user._id);
        return res.status(200).json(cart);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const addItemToCart = async (req, res) => {
    try {
        const cartItem = await cartService.addCartItems(req.user._id, req.body);
        return res.status(200).json(cartItem);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports = {
    findUserCart,
    addItemToCart
};
