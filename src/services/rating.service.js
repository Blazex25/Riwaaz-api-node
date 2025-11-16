const Rating = require("../models/rating.model");
const productService = require("./product.service");

async function createRating(reqData, user) {
    const product = await productService.findProductById(req.productId);

    const rating = new Rating({
        product: product._id,
        user: user._id,
        rating: req.rating,
        createdAt: new Date(),
    })
    return await rating.save();
}

async function getAllRatings(productId) {
    return await Rating.find({ product: productId });

}

module.exports = {
    createRating,
    getAllRatings
}