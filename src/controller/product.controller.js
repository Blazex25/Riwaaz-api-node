const productService = require('../services/product.service');

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body.data);
    return res.status(201).send(product);
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return res.status(500).send({ error: error.message });
  }
};


const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.productId);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(
      req.params.productId,
      req.body
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const findProductById = async (req, res) => {
  try {
    const product = await productService.findProductById(req.params.id); // <-- use id
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts(req.query);
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createMultipleProduct = async (req, res) => {
  try {
    await productService.createMultipleProducts(req.body);
    return res
      .status(201)
      .json({ message: "Products created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  findProductById,
  getAllProducts,
  createMultipleProduct,
};
