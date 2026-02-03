
const orderService = require('../services/orderService.js');

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const confirmedOrders = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await orderService.confirmedOrder(orderId);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const shippOrders = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await orderService.shipOrder(orderId);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deliverOrders = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await orderService.deliverOrder(orderId);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const cancelledOrders = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await orderService.cancelOrder(orderId);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteOrders = async (req, res) => {
    const { orderId } = req.params;
    try {
        await orderService.deleteOrder(orderId);
        res.status(200).json(orderId);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllOrders,
    confirmedOrders,
    shippOrders,
    deliverOrders,
    cancelledOrders,
    deleteOrders
};


