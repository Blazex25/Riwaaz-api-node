const { razorpay } = require('../config/razorpayClient.js');
const orderService = require('./orderService.js');
const Order = require('../models/order.model.js'); // ✅ added

const createPaymentLink = async (orderID) => {
    try {
        const order = await orderService.findOrderById(orderID);

        const paymentLinkRequest = {
            amount: order.totalDiscountedPrice * 100,
            currency: "INR",
            customer: {
                name: order.user.firstName + " " + order.user.lastName,
                contact: order.user.mobile,
                email: order.user.email
            },
            notify: {
                sms: true,
                email: true
            },
            reminder_enable: true,
            callback_url: `http://localhost:3000/payment/${orderID}`,
            callback_method: 'get'
        };

        const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);

        const paymentLinkId = paymentLink.id;
        const paymentLinkUrl = paymentLink.short_url;

        // ✅ store paymentLinkId in order
        order.paymentDetails.paymentLinkId = paymentLinkId;
        order.paymentDetails.method = "ONLINE";
        await order.save();

        return {
            paymentLinkId,
            paymentLinkUrl
        };

    } catch (error) {
        throw new Error(`Failed to create payment link: ${error.message}`);
    }
};

const updatePaymentInformation = async (reqData) => {

    const paymentId = reqData.razorpay_payment_id;
    const paymentLinkId = reqData.razorpay_payment_link_id; // ✅ FIX

    try {
        // ✅ find order using paymentLinkId (NOT razorpay_order_id)
        const order = await Order.findOne({
            "paymentDetails.paymentLinkId": paymentLinkId
        });

        if (!order) {
            throw new Error("Order not found for this payment link");
        }

        const payment = await razorpay.payments.fetch(paymentId);

        if (payment.status === 'captured') {
            order.paymentDetails.paymentId = paymentId;
            order.paymentDetails.status = 'PAID';   // ✅ consistent
            order.orderStatus = 'PLACED';
            await order.save();
        }

        return {
            message: 'Your order is Placed',
            success: true
        };

    } catch (error) {
        throw new Error(`Failed to update payment information: ${error.message}`);
    }
};

module.exports = {
    createPaymentLink,
    updatePaymentInformation
};
