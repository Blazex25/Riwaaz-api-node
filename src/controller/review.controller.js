const reviewService = require('../services/raview.service.js');

const createReview = async (req, res) => {
    const user = req.user;
    try {
        const review = await reviewService.createReview(req.body, user);
        return res.status(201).send(review);
    }catch (error) {
        return res.status(500).send({ error:error.message });
    }
}
const getAllReview = async (req, res) => {
    const prductId = req.params.prductId;
    const user = req.user;
    try {
        const review = await reviewService.getAllReview(prductId);
        return res.status(201).send(review);
    }catch (error) {
        return res.status(500).send({ error:error.message });
    }
}

module.exports = {
    createReview,
    getAllReview
}