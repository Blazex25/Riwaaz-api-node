const Category = require('../models/category.model.js');
const Product = require('../models/product.model.js');

async function createProduct(reqData) {
    const data = reqData.data ?? reqData;

    let topLevel = await Category.findOne({ name: data.topLevelCategory });

    if (!topLevel) {
        topLevel = await Category.create({ name: data.topLevelCategory, level: 1 });
    }

    let secondLevel = await Category.findOne({
        name: data.secondLevelCategory,
        parentCategory: topLevel._id
    });

    if (!secondLevel) {
        secondLevel = await Category.create({
            name: data.secondLevelCategory,
            parentCategory: topLevel._id,
            level: 2
        });
    }

    let thirdLevel = await Category.findOne({
        name: data.thirdLevelCategory,
        parentCategory: secondLevel._id
    });

    if (!thirdLevel) {
        thirdLevel = await Category.create({
            name: data.thirdLevelCategory,
            parentCategory: secondLevel._id,
            level: 3
        });
    }

    const product = new Product({
        title: data.title,
        color: data.color,
        description: data.description,
        discountedPrice: data.discountedPrice,
        discountPercent: data.discountPercent,
        imageUrl: data.imageUrl,
        brand: data.brand,
        price: data.price,
        size: data.size,
        quantity: data.quantity,
        category: thirdLevel._id
    });

    return await product.save();
}


async function deleteProduct(productId) {
    await Product.findByIdAndDelete(productId);
    return "Product deleted successfully";
}

async function updateProduct(productId, reqData) {
    return await Product.findByIdAndUpdate(productId, reqData, { new: true });
}

async function findProductById(productId) {
    const product = await Product.findById(productId).populate('category');
    if (!product) throw new Error("Product not found");
    return product;
}

async function getAllProducts(reqQuery) {
    let {
        category,
        colors,
        sizes,
        minPrice = 0,
        maxPrice = 999999,
        minDiscount = 0,
        sort = "price_low",
        stock,
        pageNumber = 0,
        pageSize = 10
    } = reqQuery;

    minPrice = Number(minPrice);
    maxPrice = Number(maxPrice);
    minDiscount = Number(minDiscount);
    pageNumber = Number(pageNumber);
    pageSize = Number(pageSize);

    let queryObj = {};

    
    if (category) {
        const cat = await Category.findOne({ name: new RegExp(`^${category}$`, "i") });
        if (cat) queryObj.category = cat._id;
    }

   
    if (colors) {
        queryObj.color = { $in: colors.split(",").map(c => c.trim().toLowerCase()) };
    }

    
    if (sizes) {
        queryObj["size.name"] = { $in: sizes.split(",").map(s => s.trim()) };
    }

   
    queryObj.discountedPrice = { $gte: minPrice, $lte: maxPrice };

   
    if (minDiscount > 0) {
        queryObj.discountPercent = { $gte: minDiscount }; // ✅ FIXED
    }

    
    if (stock === "in_stock") queryObj.quantity = { $gt: 0 };
    if (stock === "out_of_stock") queryObj.quantity = { $lte: 0 };

  
    let sortObj = {};
    if (sort === "price_low") sortObj.discountedPrice = 1;
    else if (sort === "price_high") sortObj.discountedPrice = -1;
    else sortObj.createdAt = -1;

    const skip = pageNumber * pageSize;

    const total = await Product.countDocuments(queryObj);
    const products = await Product.find(queryObj)
        .populate('category')
        .sort(sortObj)
        .skip(skip)
        .limit(pageSize);

    return {
        content: products,
        currentPage: pageNumber,
        totalPages: Math.ceil(total / pageSize)
    };
}

async function createMultipleProducts(products) {
    for (const product of products) {
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
