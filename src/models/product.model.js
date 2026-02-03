const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    discountedPrice: {
        type: Number,
    },
    discountPercent: {
        type: Number,
    },
    quantity: {
        type: Number,
        required: true
    },
    brand: {
        type: String,
    },
    color: {
        type: String,
    },
    size: [{
        name: { type: String },
        quantity: { type: Number }
    }],
    imageUrl: {
        type: String,
    },
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ratings"
    },
    ],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "reviews"
    },
    ],
    numRatings: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;