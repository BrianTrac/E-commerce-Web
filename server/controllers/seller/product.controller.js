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
                'images', // Giả sử hình ảnh là chuỗi JSON chứa các URL thumbnail
                'discount_rate',
                'original_price',
                'short_description',
                'description',
                'quantity_sold',
                'specifications', // Giả sử đây là kiểu dữ liệu JSON
                'rating_average',
                'price',
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
            thumbnails, // Hình ảnh thumbnail
            discount_rate: product.discount_rate,
            original_price: product.original_price,
            short_description: product.short_description,
            description: product.description,
            quantity_sold: product.quantity_sold,
            specifications: product.specifications, // JSON specifications
            rating_average: product.rating_average,
            price: product.price
        };

        res.status(200).json({ data: productDetail });
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
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
// POST /api/seller/products/add
const addProductToStore = async (req, res) => {
    try {
        const productData = req.body;

        // Kiểm tra và xử lý dữ liệu nếu cần (có thể bạn sẽ cần xử lý ảnh hay thông tin trước khi lưu)
        const newProduct = await Product.create(productData);

        res.status(201).json({
            message: 'Product successfully created',
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

module.exports = {
    getAllProductsByStoreId,
    getProductsByStoreId,
    getProductById,
    addProductToStore,
    deleteProduct
};