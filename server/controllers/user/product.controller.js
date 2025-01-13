// Desc: Product controller
const Product = require('../../models/Product');
const { Op, ValidationErrorItemOrigin } = require('sequelize');
const sequelize = require('../../config/db');
const { WEB_URL } = require('../../config/config');
//const { get } = require('../../routes/user/product.route');

let createNewProduct = async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await Product.create(productData);
        return res.status(201).json({ message: "Product created", product: newProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ message: "Error creating product" });
    }
};

let getAllProducts = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 30;
        const offset = (page - 1) * limit;

        const whereCondition = {
            inventory_status: 'available'
        };

        const result = await Product.findAndCountAll(
            {
                where: whereCondition,
                limit: limit,
                offset: offset
            }
        );

        return res.status(200).json({
            data: result.rows,
            paging: {
                current_page: page,
                total_items: result.count,
                total_pages: Math.ceil(result.count / limit),
                items_per_page: limit,
                from: offset + 1,
                to: offset + result.rows.length,
            }
        });
    } catch (err) {
        console.error('Error fetching products:', err);
        return res.status(500).json({ message: "Error fetching products" });
    }
};

// GET /api/products/?id=1
let getProductById = async (req, res) => {
    try {
        const productId = req.query.id;

        if (!productId) {
            return res.status(400).json({ error: 'Query parameter "id" is required' });
        }
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

        return res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ message: "Error updating product" });
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
        return res.status(200).json({ message: "Product deleted" });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: "Error deleting product" });
    }
};

const fetchProductsByQuery = async (query, limit, offset, filters, sortOption) => {
    const where = {};

    let relevanceScore = sequelize.literal('0');

    if (query) {
        const escapedQuery = sequelize.escape(query);
        const unaccentQuery = sequelize.fn('unaccent', escapedQuery);

        const searchCondition = sequelize.where(
            sequelize.fn(
                'to_tsvector',
                'english',
                sequelize.fn('unaccent',
                    sequelize.fn('coalesce', sequelize.literal(`name || ' ' || short_description`), '')
                ),
            ),
            '@@',
            sequelize.fn('to_tsquery', 'english', unaccentQuery),
        );

        // Fuzzy Matching using Trigram Similarity (With Unaccent)
        const fuzzyConditionName = sequelize.where(
            sequelize.fn(
                'similarity',
                sequelize.fn('unaccent', sequelize.col('name')),
                unaccentQuery,
            ),
            {
                [Op.gte]: 0.2,
            }
        );

        const fuzzyConditionShortDescription = sequelize.where(
            sequelize.fn(
                'similarity',
                sequelize.fn('unaccent', sequelize.col('short_description')),
                unaccentQuery
            ),
            {
                [Op.gte]: 0.2,
            }
        );

        where[Op.or] = [
            searchCondition,
            fuzzyConditionName,
            fuzzyConditionShortDescription,
        ];

        // Relevance Score
        relevanceScore = sequelize.literal(`
            ts_rank_cd(
                to_tsvector('english', unaccent(coalesce(name || ' ' || short_description, ''))),
                plainto_tsquery('english', unaccent(${escapedQuery}))
            ) +
            (similarity(unaccent(name), unaccent(${escapedQuery})) * 0.3) +
            (similarity(unaccent(short_description), unaccent(${escapedQuery})) * 0.2)
        `);

    }

    if (filters.rating) {
        if (filters.rating.length === 1) {
            where.rating_average = {
                [Op.gte]: filters.rating[0],
                //    [Op.lte]: filters.rating[0] + 1
            };
        } else {
            const minRating = Math.min(...filters.rating);
            const maxRating = Math.max(...filters.rating);
            where.rating_average = {
                [Op.between]: [minRating, maxRating],
            };
        }
    }

    if (filters.price) {
        where.price = {
            [Op.between]: filters.price.sort((a, b) => a - b),
        };
    }

    where.inventory_status = 'available';

    let order = [];

    switch (sortOption) {

        case 'most_relevant':
            order = [[relevanceScore, 'DESC']];
            break;
        case 'top_seller':
            order = [['quantity_sold', 'DESC']];
            break;
        case 'newest':
            order = [['created_at', 'DESC']];
            break;
        case 'price,asc':
            order = [['price', 'ASC']];
            break;
        case 'price,desc':
            order = [['price', 'DESC']];
            break;
        default:
            order = [['rating_average', 'DESC'], ['quantity_sold', 'DESC']];
            break;
    }
    //    order.unshift([relevanceScore, 'DESC']);

    const products = await Product.findAll({
        where,
        order,
        limit,
        offset,
    });

    const count = await Product.count({ where });

    return { count, rows: products };
}


// GET /api/products?limit=24&page=1&q=apple&rating=4,5&price=100,200&sort=default(popular)||price,asc||price,desc||newest||top_seller
const searchProducts = async (req, res) => {
    const {
        limit = 24,
        page = 1,
        q,
        rating,
        price,
        sort = 'default',
    } = req.query;

    const params = { limit, page, q, rating, price, sort };

    // Parse limit and page as integers, fallback to default values if not invalid
    const parsedLimit = parseInt(limit, 10) || 24;
    const parsedPage = parseInt(page, 10) || 1;
    const offset = (parsedPage - 1) * parsedLimit;

    if (!q) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    if (parsedLimit < 1 || parsedPage < 1) {
        return res.status(400).json({ error: 'Invalid limit or page number' });
    }

    // Parse rating filter
    const parsedRating = rating ? rating.split(',').map(r => parseInt(r, 10)).filter(r => !isNaN(r)) : null;

    // Parse price filter
    const parsedPrice = price ? price.split(',').map(p => parseInt(p, 10)).filter(p => !isNaN(p)) : null;

    if (parsedPrice && parsedPrice.length !== 2) {
        return res.status(400).json({ message: 'Price filter must have 2 values' });
    }

    try {
        const { count: total, rows: data } = await fetchProductsByQuery(
            q,
            parsedLimit,
            offset,
            { rating: parsedRating, price: parsedPrice },
            sort,
        );

        // Respond with pagination metadata and product data
        return res.json({
            data,
            paging: {
                current_page: parsedPage,
                from: offset + 1,
                to: offset + data.length,
                total_pages: Math.ceil(total / parsedLimit),
                per_page: parsedLimit,
                total,
            },
            params,
        });
    } catch (error) {
        console.log('Error fetching products by query:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const fetchParentCategories = async (childCategoryId) => {
    const [results] = await sequelize.query(`
        WITH RECURSIVE category_tree AS (
            SELECT id, parent_id, name, url_path, is_leaf
            FROM category
            WHERE id = :childCategoryId
            UNION ALL
            SELECT c.id, c.parent_id, c.name, c.url_path, c.is_leaf
            FROM category c
            INNER JOIN category_tree ct ON ct.parent_id = c.id
            WHERE c.id != 0  -- Stop when reaching the root category (parent_id = 0)
        )
        SELECT * FROM category_tree;
    `, {
        replacements: { childCategoryId },
    });

    // Reversing the order so the output goes from the child category to the root category
    return results.reverse();
};


// GET /api/products/:id
const detail = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findAll({
            where: {
                id: id
            },
            limit: 1
        });

        if (product.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const productData = product[0].toJSON();
        productData.breadcrumbs = await fetchParentCategories(product[0].category_id);

        return res.status(200).json(productData);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server Error' });
    }
};

// GET /api/products/search/suggestion?q=apple
const getSuggestions = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: 'Query parameter "q" is required' });
        }

        const escapedQuery = sequelize.escape(query);
        const unaccentQuery = sequelize.fn('unaccent', escapedQuery);
        const encodedQuery = encodeURIComponent(query);

        // Fetch suggestions 
        const suggestions = await Product.findAll({
            attributes: [
                'id',
                'name',
                'url_key',
                [sequelize.literal(`'${WEB_URL}/search?q=${encodedQuery}'`), 'url'],
            ],
            where: {
                inventory_status: 'available',
                [Op.or]: [
                    sequelize.where(
                        sequelize.fn(
                            'to_tsvector',
                            'english',
                            sequelize.fn('unaccent',
                                sequelize.fn('coalesce', sequelize.literal(`name || ' ' || short_description`), '')
                            ),
                        ),
                        '@@',
                        sequelize.fn('to_tsquery', 'english', unaccentQuery),
                    ),
                    sequelize.where(
                        sequelize.fn(
                            'similarity',
                            sequelize.fn('unaccent', sequelize.col('name')),
                            unaccentQuery,
                        ),
                        {
                            [Op.gte]: 0.2,
                        }
                    ),
                    sequelize.where(
                        sequelize.fn(
                            'similarity',
                            sequelize.fn('unaccent', sequelize.col('short_description')),
                            unaccentQuery
                        ),
                        {
                            [Op.gte]: 0.2,
                        }
                    ),
                ],
            },
            order: [
                [
                    sequelize.literal(`
                        ts_rank_cd(
                            to_tsvector('english', unaccent(coalesce(name || ' ' || short_description, ''))),
                            plainto_tsquery('english', unaccent('${query}'))
                        ) +
                        (similarity(unaccent(name), unaccent('${query}')) * 0.3) +
                        (similarity(unaccent(short_description), unaccent('${query} * 0.2')) )
                    `),
                    'DESC',
                ],
            ],
            limit: 6,
        });

        const data = suggestions.map(suggestion => suggestion.toJSON());

        return res.status(200).json({ data: data });

    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

// GET /api/products/top_deals?limit=36&page=1
const getTopDeals = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 36; // Items per page
        const MAX_PRODUCTS = 400; // Restrict to 400 products across all pages

        const page = parseInt(req.query.page, 10) || 1; // Default to page 1


        // Get total count of products matching the criteria
        const productCount = await Product.count({
            where: {
                inventory_status: 'available',
            },
        });

        const restrictedCount = Math.min(productCount, MAX_PRODUCTS); // Limit to MAX_PRODUCTS
        const total_pages = Math.ceil(restrictedCount / limit); // Calculate pages based on restricted count

        // Cap the page to ensure it does not exceed total_pages
        const current_page = Math.min(page, total_pages);

        const topDeals = await Product.findAll({
            where: {
                inventory_status: 'available',
            },
            order: [
                ['quantity_sold', 'DESC'],
                ['rating_average', 'DESC'],
            ],
            limit: limit,
            offset: (current_page - 1) * limit, // Adjust offset based on capped page
        });

        return res.status(200).json({
            data: topDeals,
            paging: {
                current_page: current_page,
                total_items: restrictedCount,
                total_pages: total_pages,
                items_per_page: limit,
                from: (current_page - 1) * limit + 1,
                to: Math.min(current_page * limit, restrictedCount),
            },
            title: 'Top Deals',
        });
    } catch (error) {
        console.error('Error fetching top deals:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


// GET /api/products/flash-sale?limit=36&page=1
const getFlashSale = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 36; // Items per page
        const MAX_PRODUCTS = 400; // Restrict to 400 products across all pages

        const requestedPage = parseInt(req.query.page, 10) || 1; // Default to page 1
        const offset = (requestedPage - 1) * limit;

        // Get total count of products matching the criteria
        const productCount = await Product.count({
            where: {
                discount_rate: {
                    [Op.gt]: 10, // Only products with a discount
                },
                inventory_status: 'available', // Ensure the product is in stock
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
            },
            order: [
                ['discount_rate', 'DESC'], // Sort by discount rate descending
                ['rating_average', 'DESC'], // Then by rating average descending
            ],
            limit: limit,
            offset: (current_page - 1) * limit, // Adjust offset based on capped page
        });

        return res.status(200).json({
            data: flashSale,
            paging: {
                current_page: current_page,
                total_items: restrictedCount,
                total_pages: total_pages,
                items_per_page: limit,
                from: (current_page - 1) * limit + 1,
                to: Math.min(current_page * limit, restrictedCount),
            },
            title: 'Flash Sale',
        });
    } catch (error) {
        console.error('Error fetching flash sale:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// [GET] /api/products/:id/related
let getRelatedProducts = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await sequelize.query(
            `SELECT * FROM product WHERE id = :id`,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: { id },
            }
        );

        if (product.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const categoryId = product[0].category_id;

        const relatedProducts = await sequelize.query(
            `
            WITH RECURSIVE CategoryHierarchy AS (
                SELECT id, parent_id, name
                FROM category
                WHERE id = :categoryId

                UNION ALL

                SELECT c.id, c.parent_id, c.name
                FROM category c
                INNER JOIN CategoryHierarchy ch ON c.id = ch.parent_id
            )
            SELECT 
                p.*
            FROM product p
            JOIN CategoryHierarchy ch ON p.category_id = ch.id
            WHERE p.id != :id
            LIMIT 10
            `,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    categoryId,
                    id,
                },
            }
        );
        return res.status(200).json({
            data: relatedProducts,
            total: relatedProducts.length,
            title: 'Related Products',
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const Sequelize = require('../../config/db');

const getSomeProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: {
                inventory_status: 'available',
            },
            order: [
                Sequelize.literal('RANDOM()')
            ],
            limit: 80,
        });

        return res.status(200).json({
            data: products,
            title: 'Magic',
        });
    } catch (error) {
        console.error('Error fetching magic:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createNewProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
    detail,
    getSuggestions,
    getTopDeals,
    getFlashSale,
    getRelatedProducts,
    getSomeProducts,
};