const CartItem = require('../models/cartItem.model');
const userService = require('../services/user.service');


async function updateCartItem(userId, cartItemId, cartItemData) {

    try {
        const item = await findCartItemById(cartItemId);
        if (!item) {
            throw new Error('Cart item not found', cartItemId);
        }
        const user = await userService.findUserById(userId);
        if (!user) {
            throw new Error('User not found', userId);
        }
        if (user._id.toString() === userId.toString()) {
            if (cartItemData.quantity !== undefined) {
                item.quantity = cartItemData.quantity;
            }


            if (cartItemData.price !== undefined) {
                item.price = cartItemData.price;
            }

            if (cartItemData.discountedPrice !== undefined) {
                item.discountedPrice = cartItemData.discountedPrice;
            }
            const updateCartItem = await item.save();
            return updateCartItem;
        } else {
            throw new Error('Unauthorized access to cart item');
        }
    } catch (error) {
        throw new Error('Error updating cart item: ' + error.message);
    }

}

async function removeCartItem(userId, cartItemId) {

    const cartItem = await findCartItemById(cartItemId);
    const user = await userService.findUserById(userId);

    if (user._id.toString() === cartItem.userId.toString()) {
        return await CartItem.findByIdAndDelete(cartItemId)
    } else {
        throw new Error('Unauthorized access to cart item');
    }
}

async function findCartItemById(cartItemId) {
    const cartItem = await CartItem.findById(cartItemId).populate('product');
    if (cartItem) {
        return cartItem
    } else {
        throw new Error("CartItem not Found With ID ", cartItemId)
    }
}
module.exports = { updateCartItem, removeCartItem, findCartItemById };