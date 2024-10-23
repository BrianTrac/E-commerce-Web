// Desc: Product controller
const Product = require('../models/Product');

let createNewProduct = async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await Product.create(productData);
        res.status(201).json({ message: "Product created", product: newProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: "Error creating product" });
    }
};

let getAllProducts = async (req, res) => {
    try {
        const result = await Product.findAll();
        return res.status(200).json({
            message: "ok",
            products: result
        });
    } catch (err) {
        console.error('Error fetching products:', err);
        return res.status(500).json({ message: "Error fetching products" });
    }
};

let getProductById = async (req, res) => {
    const productId = req.params.id;

    try {
        const result = await Product.findByPk(productId);

        if (result === null) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Product fetched successfully",
            product: result
        });
    } catch (err) {
        console.error('Error fetching product:', err);
        return res.status(500).json({ message: "Error fetching product" });
    }
};

let updateProduct = async (req, res) => {
    const productId = req.params.id;
    const newProductData = req.body;

    try {
        const product = await Product.findByPk(productId);
        if (product === null) {
            return res.status(404).json({ message: "Product not found" });
        }

        await Product.update(newProductData, {
            where: { id: productId }
        });

        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: "Error updating product" });
    }
};

let deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const result = await Product.destroy({
            where: {
                id: productId
            }
        });
        if (result === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted" });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: "Error deleting product" });
    }
};

module.exports = {
    createNewProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
