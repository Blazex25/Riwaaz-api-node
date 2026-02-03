const Address = require("../models/address.model.js");
const cartService = require("../services/cart.service.js")
const Order = require("../models/order.model.js");
const OrderItem = require("../models/orderItems.model.js");



async function creatOrder(user, shipAddress) {
    let address;

    if (shipAddress._id) {
        let existAddress = await Address.findById(shipAddress._id);
        address = existAddress;
    } else {
        address = new Address(shipAddress);
        address.user = user;
        await address.save();

        user.address.push(address);
        await user.save();
    }

    const cart = await cartService.findUserCart(user._id);
    const orderItems = [];

    for (const item of cart.cartItems) {
        const orderItem = new OrderItem({
            price: item.price,
            quantity: item.quantity,
            product: item.product,
            size: item.size,
            userId: item.userId,
            discountedPrice: item.discountedPrice,
        });

        const createdOrderItem = await orderItem.save();
        orderItems.push(createdOrderItem);
    }


    const createdOrder = new Order({
        user,
        orderItems,


        orderDate: new Date(),
        deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),

        totalPrice: cart.totalPrice,
        totalDiscountedPrice: cart.totalDiscountedPrice,
        discount: cart.discount,
        totalItems: cart.totalItems,

        shippingAddress: address,


        paymentDetails: {
            method: "COD",          // or ONLINE
            paymentId: null,
            paymentLinkId: null,
            status: "PENDING",
        },
        orderStatus: "PENDING",

    });

    const savedOrder = await createdOrder.save();
    return savedOrder;
}

async function placeOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = 'PLACED';
    order.paymentDetails.status = 'PAID';


    return await order.save();
}
async function confirmedOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = 'Confirmed';

    return await order.save();
}
async function shipOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = 'Shipped';

    return await order.save();
}
async function deliverOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = 'Delivered';

    return await order.save();
}
async function cancelOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = 'Cancelled';

    return await order.save();
}
async function findOrderById(orderId) {
    try {
        const order = await Order.findById(orderId)
            .populate("shippingAddress")
            .populate("user")
            .populate({
                path: "orderItems",
                populate: {
                    path: "product"
                }
            });

        if (!order) {
            throw new Error("Order not found");
        }

        return order;

    } catch (error) {
        console.error("findOrderById error:", error);
        throw error;
    }
}


async function userOrderHistory(userId) {
    try {
        const orders = await Order.find({ user: userId, orderStatus: "PLACED" })
            .populate({ path: "orderItems", populate: { path: "product" } }).lean();
        return orders;

    } catch (error) {
        throw new Error('Error fetching user order history: ' + error.message);
    }
}

async function getAllOrders() {
    return await Order.find().populate({ path: "orderItems", populate: { path: "product" } }).lean();
}

async function deleteOrder(orderId) {
    const order = await findOrderById(orderId);
    await Order.findByIdAndDelete(order._id);

}

module.exports = {
    creatOrder,
    placeOrder,
    confirmedOrder,
    shipOrder,
    deliverOrder,
    cancelOrder,
    findOrderById,
    userOrderHistory,
    getAllOrders,
    deleteOrder,
}