// Desc: Product controller
const Product = require('../../models/Product');
const Seller = require('../../models/Seller');
const User = require('../../models/User');
const Sequelize = require('sequelize');
const { Op } = Sequelize;
const { addNotification } = require('../../services/adminNotifcation.service');


// Get all products by store ID
// GET /api/seller/products/
const getAllProductsByStoreId = async (req, res) => {
    const seller_id = req.user.id;

    const seller = await Seller.findOne({
        where: { user_id: seller_id },
        attributes: ['store_id']
    });

    const storeId = seller?.store_id;

    if (!storeId) {
        return res.status(400).json({ message: 'storeId is required' });
    }

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const status = req.query.status || '';
        const sortField = req.query.sortField || 'id'; // Default sort field
        const sortOrder = req.query.sortOrder === 'DESC' ? 'DESC' : 'ASC'; // Default sort order

        const offset = (page - 1) * limit;

        const whereCondition = {
            'current_seller.store_id': storeId,
            ...(search && {
                name: {
                    [Op.iLike]: `${search}%`,
                },
            }),
            ...(status && { inventory_status: status })
        };

        // Adjust sortField for database query
        const dbSortField = sortField === 'category'
            ? 'category_name'
            : sortField === 'rating'
            ? 'rating_average'
            : sortField;

        const totalCount = await Product.count({ where: whereCondition });

        const products = await Product.findAll({
            where: whereCondition,
            order: [[dbSortField, sortOrder]], // Sort dynamically
            limit: limit,
            offset: offset,
            attributes: [
                'id',
                'name',
                'images',
                'category_name',
                'price',
                'rating_average',
                'qty',
                'inventory_status'
            ]
        });

        const formattedProducts = products.map(product => {
            const images = Array.isArray(product.images)
                ? product.images
                : JSON.parse(product.images || '[]');
            const thumbnails = images.map(image => image.thumbnail_url);
            return {
                id: product.id,
                name: product.name,
                category: product.category_name,
                price: product.price,
                rating: product.rating_average,
                qty: product.qty,
                thumbnails,
                inventory_status: product.inventory_status
            };
        });

        return res.status(200).json({
            data: formattedProducts,
            total: totalCount,
            page: page,
            limit: limit
        });
    } catch (error) {
        console.error('Error in getAllProductsByStoreId:', error);
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


// Get top 10 selling products
// GET /api/seller/products/:storeId/top-selling/
const getTopSellingProducts_v1 = async (req, res) => {
    try {
        const storeId = req.params.storeId;

        const products = await Product.findAll({
            where: { 'current_seller.store_id': storeId },
            order: [['quantity_sold', 'DESC']],
            limit: 10,
            attributes: [
                'id',
                'name',
                'images',
                'category_name',
                'price',
                'rating_average',
                'quantity_sold',
                'inventory_status'
            ]
        });

        const formattedProducts = products.map(product => {
            const images = Array.isArray(product.images)
                ? product.images
                : JSON.parse(product.images || '[]');
            const thumbnails = images.map(image => image.thumbnail_url);
            return {
                id: product.id,
                name: product.name,
                category: product.category_name,
                price: product.price,
                rating: product.rating_average,
                quantity_sold: product.quantity_sold,
                thumbnails
            };
        });

        res.status(200).json({ data: formattedProducts });
    } catch (error) {
        console.error('Error fetching top 10 best-selling products:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const getProductById = async (req, res) => {
    const id = req.params.productId;

    if (!id) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    try {
        // Tìm sản phẩm theo ID
        const product = await Product.findByPk(id, {
            attributes: [
                'name',
                'category_id',
                'category_name',
                'images', // Giả sử hình ảnh là chuỗi JSON chứa các URL thumbnail
                'discount_rate',
                'original_price',
                'short_description',
                'description',
                'quantity_sold',
                'specifications', // Giả sử đây là kiểu dữ liệu JSON
                'rating_average',
                'price',
                'inventory_status',
                'qty',
            ]
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Xử lý dữ liệu hình ảnh
        const images = Array.isArray(product.images)
            ? product.images
            : JSON.parse(product.images || '[]');
        const thumbnails = images.map(image => image.thumbnail_url);

        // Trả về dữ liệu sản phẩm
        const productDetail = {
            name: product.name,
            category_id: product.category_id,
            category_name: product.category_name,
            thumbnails, // Hình ảnh thumbnail
            discount_rate: product.discount_rate,
            original_price: product.original_price,
            short_description: product.short_description,
            description: product.description,
            quantity_sold: product.quantity_sold,
            specifications: product.specifications, // JSON specifications
            rating_average: product.rating_average,
            price: product.price,
            inventory_status: product.inventory_status,
            qty: product.qty,
        };

        res.status(200).json({ data: productDetail });
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add a product to a store
// POST /api/seller/products/add
const addProductToStore = async (req, res) => {
    try {
        const productData = req.body;

        // Lấy store_id
        const seller = await Seller.findOne({
            where: {
                user_id: req.user.id
            }
        });

        if(!seller) {
            return res.status(400).json({ message: 'Seller not found' });
        }

        if (!productData.current_seller) {
            productData.current_seller = {};
        }

        productData.current_seller.id = seller.id;
        productData.current_seller.store_id = seller.store_id;

        // Kiểm tra và xử lý dữ liệu nếu cần (có thể bạn sẽ cần xử lý ảnh hay thông tin trước khi lưu)
        const newProduct = await Product.create(productData);

        await addNotification(productData.current_seller.store_id, productData.name);

        res.status(201).json({
            message: 'Add product successfully, wait for admin approve',
            product: newProduct
        });
    } catch (error) {
        console.error('Error adding product to store:', error);
        res.status(500).json({
            message: 'Internal server error while adding product',
            error: error.message
        });
    }
};

// Remove a product from a store
// DELETE /api/seller/products/remove/:productId
const deleteProduct = async (req, res) => {
    const productId = req.params.productId;

    try {
        console.log(`Attempting to delete product with ID: ${productId}`); // Debug log
        const result = await Product.destroy({
            where: {
                id: productId,
            },
        });

        if (result === 0) {
            console.warn(`Product with ID: ${productId} not found`);
            return res.status(404).json({ message: "Product not found" });
        }

        console.log(`Product with ID: ${productId} deleted successfully`);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: "Error deleting product" });
    }
};

const deleteMultipleProducts = async (req, res) => {
    const { ids } = req.body;

    try {
        console.log(`Attempting to delete multiple products with IDs: ${ids}`); // Debug log
        
        // Kiểm tra nếu danh sách IDs trống hoặc không hợp lệ
        if (!Array.isArray(ids) || ids.length === 0) {
            console.warn('No valid product IDs provided for deletion');
            return res.status(400).json({ message: "No valid product IDs provided" });
        }

        // Thực hiện xóa sản phẩm
        const result = await Product.destroy({
            where: {
                id: ids, // Xóa tất cả các sản phẩm có ID nằm trong danh sách ids
            },
        });

        console.log(`Number of products deleted: ${result}`); // Debug log

        // Nếu không xóa được sản phẩm nào
        if (result === 0) {
            console.warn(`No products found matching the provided IDs: ${ids}`);
            return res.status(404).json({ message: "No products found for deletion" });
        }

        console.log(`Products with IDs ${ids} deleted successfully`);
        res.status(200).json({ message: `${result} product(s) deleted successfully` });
    } catch (error) {
        console.error('Error deleting multiple products:', error);
        res.status(500).json({ message: "Error deleting multiple products" });
    }
};


const updateProduct = async (req, res) => {
    const productId = req.params.productId;
    const updateData = req.body;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Cập nhật dữ liệu sản phẩm
        const updatedProduct = await product.update(updateData);

        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct,
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            message: 'Internal server error while updating product',
            error: error.message,
        });
    }
};


// Get top selling products of a store
// GET /api/seller/product/top-selling/limit=55&page=1
let getTopSellingProducts_v2 = async (req, res) => {
    try {
        const id = req.user.id;

        const seller = await Seller.findOne({
            where: {
                user_id: id
            }
        });

        const storeId = seller.store_id;

        if (!storeId) {
            return res.status(400).json({ message: "Missing storeId parameter" });
        }

        const limit = parseInt(req.query.limit) || 20;  // Number of products per page 
        const page = parseInt(req.query.page) || 1;    // Default to page 1
        const offset = (page - 1) * limit;            // Calculate offset for pagination

        // Correct way to cast the JSON store_id to integer and compare
        const topSellingProducts = await Product.findAll({
            attributes: [
                'id',
                'name',
                'price',
                'rating_average',
                'quantity_sold',
                'images',
                [Sequelize.literal('price * quantity_sold'), 'earnings']
            ],
            where: Sequelize.where(
                Sequelize.cast(Sequelize.json('current_seller.store_id'), 'INTEGER'),
                storeId
            ),
            order: [['quantity_sold', 'DESC']],
            limit,
            offset
        });

        const totalItems = await Product.count({
            where: {
                'current_seller.store_id': storeId
            }
        });

        const formattedProducts = topSellingProducts.map(product => {
            const images = Array.isArray(product.images)
                ? product.images
                : JSON.parse(product.images || '[]');
            const thumbnails = images.map(image => image.thumbnail_url);
            return {
                id: product.id,
                name: product.name,
                price: product.price,
                rating: product.rating_average,
                quantity_sold: product.quantity_sold,
                thumbnails,
                earnings: product.dataValues.earnings
            };
        });

        res.status(200).json({
            message: "Top selling products fetched successfully",
            currentPage: page,
            pageSize: limit,
            totalItems: totalItems,
            products: formattedProducts
        });
    } catch (error) {
        console.error('Error fetching top selling products:', error);
        res.status(500).json({ message: "Error fetching top selling products" });
    }
};


// Get flash sale products of a store
// GET /api/seller/product/flash-sale/:storeId?limit=36&page=1
const getFlashSaleProducts = async (req, res) => {
    try {
        const { storeId } = req.params;
        if (!storeId) {
            return res.status(400).json({ message: "Missing storeId parameter" });
        }

        const limit = parseInt(req.query.limit, 10) || 36; // Items per page
        const MAX_PRODUCTS = 400; // Restrict to 400 products across all pages

        const requestedPage = parseInt(req.query.page, 10) || 1;
        const offset = (requestedPage - 1) * limit;

        // Get total count of products matching the criteria
        const productCount = await Product.count({
            where: {
                discount_rate: {
                    [Op.gt]: 10, // Only products with a discount
                },
                inventory_status: 'available', // Ensure the product is in stock
                'current_seller.store_id': storeId, // Filter by store ID
            },
        });

        const restrictedCount = Math.min(productCount, MAX_PRODUCTS); // Cap total items at MAX_PRODUCTS
        const total_pages = Math.ceil(restrictedCount / limit); // Calculate pages based on restricted count

        // Cap the requested page to ensure it does not exceed total_pages
        const current_page = Math.min(requestedPage, total_pages);

        const flashSale = await Product.findAll({
            where: {
                discount_rate: {
                    [Op.gt]: 10, // Only products with a discount
                },
                inventory_status: 'available', // Ensure the product is in stock
                'current_seller.store_id': storeId, // Filter by store ID
            },
            order: [
                ['discount_rate', 'DESC'], // Sort by discount rate descending
                ['rating_average', 'DESC'], // Then by rating average descending
            ],
            limit: limit,
            offset: (current_page - 1) * limit, // Adjust offset based on capped page
        });

        res.status(200).json({
            data: flashSale,
            paging: {
                current_page: current_page,
                total_items: restrictedCount,
                total_pages: total_pages,
                items_per_page: limit,
                from: (current_page - 1) * limit + 1,
                to: Math.min(current_page * limit, restrictedCount),
            },
            title: `Flash Sale - Store ${storeId}`,
        });
    } catch (error) {
        console.error('Error fetching flash sale:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllProductsByStoreId,
    getTopSellingProducts_v1,
    getProductById,
    addProductToStore,
    deleteProduct,
    deleteMultipleProducts,
    updateProduct,
    getTopSellingProducts_v2,
    getFlashSaleProducts,
};