// Desc: Product controller
const Product = require('../../models/Product');
const Sequelize = require('sequelize');
const { Op } = Sequelize;


// Get all products by store ID
// GET /api/seller/product/:storeId
const getAllProductsByStoreId = async (req, res) => {
    const storeId = req.params.storeId;

    if (!storeId) {
        return res.status(400).json({ message: 'storeId is required' });
    }

    try {
        // Lấy query từ request
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        // Tính toán offset cho phân trang
        const offset = (page - 1) * limit;

        // Điều kiện tìm kiếm
        const whereCondition = {
            'current_seller.store_id': storeId, // Điều kiện bắt buộc cho store_id
            ...(search && {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${search}%` } }, // Tìm kiếm theo name
                ]
            }),
        };

        // Lấy tổng số sản phẩm để dùng cho phân trang
        const totalCount = await Product.count({
            where: whereCondition
        });

        // Lấy danh sách sản phẩm theo trang
        const products = await Product.findAll({
            where: whereCondition,
            order: [['rating_average', 'DESC']], // Sắp xếp theo điểm đánh giá trung bình giảm dần
            limit: limit,
            offset: offset,
            attributes: [
                'id',
                'name',
                'images',
                'category_name',
                'price',
                'rating_average',
                'qty'
            ]
        });

        // Xử lý định dạng dữ liệu trước khi trả về
        const formattedProducts = products.map(product => {
            const images = Array.isArray(product.images)
                ? product.images
                : JSON.parse(product.images || '[]'); // Nếu là chuỗi JSON, parse sang mảng
            const thumbnails = images.map(image => image.thumbnail_url);
            return {
                id: product.id,
                name: product.name,
                category: product.category_name,
                price: product.price,
                rating: product.rating_average,
                qty: product.qty,
                thumbnails
            };
        });

        // Trả về kết quả
        res.status(200).json({
            data: formattedProducts,
            total: totalCount,
            page: page,
            limit: limit
        });
    } catch (error) {
        console.error('Error in getAllProductsByStoreId:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};




// Get products by store ID with pagination
// GET /api/seller/product/:storeId/paging?limit=10&page=1
let getProductsByStoreId = async (req, res) => {
    const storeId = req.params.storeId;
    console.log('storeId:', storeId);
    const page = parseInt(req.query.page) || 1;     // Page number, deafult is 1
    const limit = parseInt(req.query.limit) || 10; // Items per page, default is 10 items
    const offset = (page - 1) * limit;

    try {
        const { count, rows: products } = await Product.findAndCountAll({
            where: { 'current_seller.store_id': storeId }, 
            limit: limit, 
            offset: offset,
        });

        res.status(200).json({
            storeId: storeId,
            currentPage: page,     
            count: products.length,   
            totalProducts: count,    
            totalPages: Math.ceil(count / limit), 
            products: products       
        });
    } catch (error) {
        console.error('Error fetching products by shop ID', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Add a product to a store
// POST /api/seller/product/add
let addProductToStore = async (req, res) => {
    try {
        const productData = req.body;
        console.log('productData:', productData);
        const newProduct = await Product.create(productData);
        res.status(201).json({ message: "Product created", product: newProduct });
    } catch (error) {
        console.error('Error adding product to store:', error);
        res.status(500).json({ message: "Error adding product to store" });
    }
};


// Remove a product from a store
// DELETE /api/seller/product/remove/:id
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
    getAllProductsByStoreId,
    getProductsByStoreId,
    addProductToStore,
    deleteProduct
};