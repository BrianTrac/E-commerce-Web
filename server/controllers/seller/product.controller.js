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
        const status = req.query.status || '';

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
            ...(status && { inventory_status: status }) // Lọc theo trạng thái
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
                'qty',
                'inventory_status'
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
                thumbnails,
                inventory_status: product.inventory_status
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
                'inventory_status'
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
            price: product.price,
            inventory_status: product.inventory_status
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
// GET /api/seller/product/top-selling/:storeId?limit=55&page=1
let getTopSellingProducts = async (req, res) => {
    try {
        const storeId = req.params.storeId;

        if (!storeId) {
            return res.status(400).json({ message: "Missing storeId parameter" });
        }

        const limit = parseInt(req.query.limit) || 5;  // Number of products per page 
        const page = parseInt(req.query.page) || 1;   
        const offset = (page - 1) * limit;           

        const topSellingProducts = await Product.findAll({
            attributes: [
                'id',
                'name',
                'price',
                'quantity_sold',
                [Sequelize.literal('price * quantity_sold'), 'earnings']
            ],
            where: Sequelize.json('current_seller.store_id', storeId),
            order: [['quantity_sold', 'DESC']],
            limit, 
            offset 
        });

        const totalItems = await Product.count({
            where: Sequelize.json('current_seller.store_id', storeId)
        });

        res.status(200).json({
            message: "Top selling products",
            currentPage: page,       
            limit: limit, 
            totalItems: totalItems,
            products: topSellingProducts
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
    getProductById,
    addProductToStore,
    deleteProduct,
    updateProduct,
    getTopSellingProducts,
    getFlashSaleProducts,
};