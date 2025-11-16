const orderService = require('../services/orderService.js');

const createOrder = async (req, res) => {
    const user = await req.user;
    try {
        let createdOrder = await orderService.creatOrder(user, req.body);
        res.status(201).send(createdOrder);

    }catch (error) {
        return res.status(500).send({ error:error.message });

    }
}
const findOrderById = async (req, res) => {
    const user =await req.user;
    try {
        let createdOrder = await orderService.findOrderById(req.params.id);
        res.status(201).send(createdOrder);

    }catch (error) {
        return res.status(500).send({ error:error.message });

    }
}
const OrderHistory = async (req, res) => {
    const user =await req.user;
    try {
        let createdOrder = await orderService.userOrderHistory(user._id);
        res.status(201).send(createdOrder);

    }catch (error) {
        return res.status(500).send({ error:error.message });

    }
}
module.exports = {
    createOrder,
    findOrderById,
    OrderHistory
}