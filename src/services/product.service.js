const Category = require('../models/category.model.js');
const Product = require('../models/product.model.js');

async function createProduct(reqData) {


    let topLevel = await Category.findOne({ name: reqData.topLevelCategory });

    if (!topLevel) {
        topLevel = new Category({ name: reqData.topLevelCategory, level: 1 });
        await topLevel.save();
    }
    let secondLevel = await Category.findOne({ name: reqData.secondLevelCategory, parentCategory: topLevel._id })
    if (!secondLevel) {
        secondLevel = new Category({ name: reqData.secondLevelCategory, parentCategory: topLevel._id, level: 2 });
        await secondLevel.save();
    }

    let thirdLevel = await Category.findOne({ name: reqData.thirdLevelCategory, parentCategory: secondLevel._id })
    if (!thirdLevel) {
        thirdLevel = new Category({ name: reqData.thirdLevelCategory, parentCategory: secondLevel._id, level: 3 });
        await thirdLevel.save();
    }

    const product = new Product({
        title: reqData.title,
        color: reqData.color,
        description: reqData.description,
        discountedPrice: reqData.discountedPrice,
        discountpersent: reqData.discountpersent,
        imageUrl: reqData.imageUrl,
        brand: reqData.brand,
        price: reqData.price,
        size: reqData.size,
        quantity: reqData.quantity,
        category: thirdLevel._id

    })
    return await product.save();
}

async function deleteProduct(productId) {
    await Product.findByIdAndDelete(productId);

    return "Product deleted successfully";
}

async function updateProduct(productId, reqData) {
    return await Product.findByIdAndUpdate(productId, reqData);
}

async function findProductById(productId) {
    const product = await Product.findById(productId).populate('category').exec();

    if (!product) {
        throw new Error('Product not found with the given ID' + productId);
    }
    return product;
}

async function getAllProducts(reqQuery) {
    let { category, color, sizes, minPrize, maxPrice, minDiscount, sort, stock, pageNumberr, pageSize } = reqQuery;

    pageSize = pageSize || 10;

    let query = Product.find().populate('category');

    if (category) {
        const existCategory = await Category.findOne({ name: category });
        if (existCategory) {
            query = query.where('category').equals(existCategory._id);
        } else {
            return { content: [], currentPage: 1, totalPages: 0 }
        }
    }
    if (color) {
        const colorSet = new Set(color.split(',').map(color => color.trim().toLowerCase()));

        const colorRegex = colorSet.size > 0 ? new RegExp([...colorSet].join('|'), 'i') : null;

        query = query.where('color').regex(colorRegex);
    }
    if (sizes) {
        const sizesSet = new Set(sizes);
        query = query.where('sizes.name').in([...sizesSet]);
    }
    if (minPrize && maxPrice) {
        query = await query.where('discountedPrice').gte(minPrize).lte(maxPrice);
    }
    if (minDiscount) {
        query = query.where('discountpercent').gte(minDiscount);
    }
    if (stock) {
        if (stock === 'in') {
            query = query.where('quantity').gt(0);
        }
        else if (stock === 'out_of_stock') {
            query = query.where('quantity').gt(1);
        }
    }
    if (sort) {
        const sortDirection = sort === "price_hight_to_low" ? -1 : 1;
        query = query.sort({ discountedPrice: sortDirection });
    }
    const totalProduct = await Product.countDocuments(query);

    const skip = (pageNumberr - 1) * pageSize;

    query = query.skip(skip).limit(pageSize);

    const products = await query.exec();

    const totalPages = Math.ceil(totalProduct / pageSize);

    return { content: products, currentPage: pageNumberr, totalPages: totalPages };
}

async function createMultipleProducts(products) {
    for (let product of products) {
        await createProduct(product);
    }
}

module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
    findProductById,
    getAllProducts,
    createMultipleProducts
};