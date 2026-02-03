const Cart = require('../models/cart.model');
const CartItem = require('../models/cartItem.model');
const Product = require('../models/product.model');

async function createCart(user) {
    try {
        const cart = new Cart({ user });
        const createdCart = await cart.save();
        return createdCart;
    } catch (error) {
        throw new Error('Error creating cart: ' + error.message);
    }
}


async function findUserCart(userId) {
    try {
        let cart = await Cart.findOne({ user: userId });

       
        if (!cart) {
            return {
                cartItems: [],
                totalPrice: 0,
                totalDiscountedPrice: 0,
                totalItem: 0,
                discount: 0
            };
        }

        
        let cartItems = await CartItem.find({ cart: cart._id }).populate('product');
        cart.cartItems = cartItems;

        
        let totalPrice = 0;
        let totalDiscountedPrice = 0;
        let totalItem = 0;

        for (let cartItem of cart.cartItems) {
            totalPrice += cartItem.price * cartItem.quantity;
            totalDiscountedPrice += cartItem.discountedPrice * cartItem.quantity;
            totalItem += cartItem.quantity;
        }

        cart.totalPrice = totalPrice;
        cart.discount = totalPrice - totalDiscountedPrice;
        cart.totalItems = totalItem;
        cart.totalDiscountedPrice = totalPrice - cart.discount;

        return cart;
    } catch (error) {
        throw new Error('Error finding user cart: ' + error.message);
    }
}

async function addCartItems(userId, req) {
    try {
        
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = await createCart(userId);
        }

       
        const productData = await Product.findById(req.productId);
        if (!productData) {
            throw new Error("Product not found");
        }

       
        let cartItem = await CartItem.findOne({
            cart: cart._id,
            product: productData._id,
            size: req.size,
            userId
        });

        if (cartItem) {
          
            cartItem.quantity += 1;
            await cartItem.save();
            return { message: "Item quantity updated", cartItem };
        }

        
        cartItem = new CartItem({
            product: productData._id,
            cart: cart._id,
            quantity: 1,
            userId,
            price: productData.price,
            discountedPrice: productData.discountedPrice ?? productData.price,
            size: req.size
        });

        const createdCartItem = await cartItem.save();

       
        cart.cartItems.push(createdCartItem._id);
        await cart.save();

        return { message: "Item added to cart successfully", cartItem: createdCartItem };
    } catch (error) {
        throw new Error('Error adding item to cart: ' + error.message);
    }
}

module.exports = { createCart, findUserCart, addCartItems };
