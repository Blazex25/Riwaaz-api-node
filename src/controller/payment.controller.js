const paymentService = require('../services/paymentService.js');


const createPaymentLink = async (req, res) => {
    try {
        const paymentLink = await paymentService.createPaymentLink(req.params.id);
        res.status(200).send(paymentLink);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}
const UpdatePaymentInformation = async (req, res) => {
    try {
        await paymentService.updatePaymentInformation(req.query);
        res.status(200).send({ message: 'Payment information updated successfully', success: true });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = {
    createPaymentLink,
    UpdatePaymentInformation
};