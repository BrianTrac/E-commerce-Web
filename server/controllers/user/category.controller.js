const Category = require('../../models/Category');
const Product = require('../../models/Product');
const { QueryTypes, Op } = require('sequelize');
const sequelize  = require('../../config/db');

const getCategoryTreeOptimizedWithMap = async (parentId, level=2) => {
    const allCategories = await Category.findAll({
        attributes: ['id', 'name', 'parent_id', 'is_leaf', 'thumbnail_url', 'url_path'],
        raw: true,
    });

//    console.log('All categories:', allCategories.length);

    // Build a map for quick access
    const categoryMap = allCategories.reduce((map, category) => {
        map[category.id] = category;
        return map;
    }, {});

    // Build the tree recursively
    const buildTree = (parentId) => {
        if (level === 0) return [];
        level--;
        const children = Object.values(categoryMap).filter(category => category.parent_id === parentId);
        return children.map((child) => ({
            ...child,
            children: child.is_leaf ? [] : buildTree(child.id),
        }));
    };

    return buildTree(parentId);
};

const getCategoryTreeWithCTE = async (parentId) => {
    const query = `
        WITH RECURSIVE category_tree AS (
            -- Base case: fetch the root categories
            SELECT 
                id,
                name,
                parent_id,
                is_leaf,
                thumbnail_url,
                url_path,
                0 as level
            FROM category
            WHERE parent_id = :parentId

            UNION ALL

            -- Recursive case: fetch children
            SELECT 
                c.id,
                c.name,
                c.parent_id,
                c.is_leaf,
                c.thumbnail_url,
                c.url_path,
                ct.level + 1
            FROM category c
            INNER JOIN category_tree ct ON ct.id = c.parent_id
        )
        -- Build the hierarchical JSON structure
        SELECT 
            jsonb_agg(
                jsonb_build_object(
                    'id', t.id,
                    'name', t.name,
                    'parent_id', t.parent_id,
                    'is_leaf', t.is_leaf,
                    'thumbnail_url', t.thumbnail_url,
                    'url_path', t.url_path,
                    'children', (
                        SELECT COALESCE(jsonb_agg(
                            jsonb_build_object(
                                'id', c.id,
                                'name', c.name,
                                'parent_id', c.parent_id,
                                'is_leaf', c.is_leaf,
                                'thumbnail_url', c.thumbnail_url,
                                'url_path', c.url_path,
                                'children', (
                                    SELECT COALESCE(jsonb_agg(
                                        jsonb_build_object(
                                            'id', gc.id,
                                            'name', gc.name,
                                            'parent_id', gc.parent_id,
                                            'is_leaf', gc.is_leaf,
                                            'thumbnail_url', gc.thumbnail_url,
                                            'url_path', gc.url_path,
                                            'children', COALESCE(
                                                (
                                                    SELECT jsonb_agg(
                                                        jsonb_build_object(
                                                            'id', ggc.id,
                                                            'name', ggc.name,
                                                            'parent_id', ggc.parent_id,
                                                            'is_leaf', ggc.is_leaf,
                                                            'thumbnail_url', ggc.thumbnail_url,
                                                            'url_path', ggc.url_path,
                                                            'children', '[]'::jsonb
                                                        )
                                                    )
                                                    FROM category_tree ggc
                                                    WHERE ggc.parent_id = gc.id
                                                ), '[]'::jsonb)
                                        )
                                    ), '[]'::jsonb)
                                    FROM category_tree gc
                                    WHERE gc.parent_id = c.id
                                )
                            )
                        ), '[]'::jsonb)
                        FROM category_tree c
                        WHERE c.parent_id = t.id
                    )
                )
            ) as category_tree
        FROM category_tree t
        WHERE t.parent_id = :parentId;
    `;

    const [results] = await sequelize.query(query, {
        replacements: { parentId },
        type: QueryTypes.SELECT,
    });

    // Extract the category_tree array from the result
    return results.category_tree || [];
};

// GET /api/categories?include=children|ancestor&parent_id=value
const getCategoryTree = async (req, res) => {
    let { include, parent_id } = req.query;
    parent_id = parseInt(parent_id);
    

    try {
        if (!['children', 'ancestor'].includes(include) || isNaN(parent_id)) {
            return res.status(400).json({ message: 'Invalid query parameters' });
        }
        
        if (include === 'children') {
            // Fetch the children of the specified category
            let level = 1; // Level 1 for root categories
            
            if (parent_id !== 0) {
                // Check if the parent_id exists
                const parentCategory = await Category.findByPk(parent_id, {
                    attributes: ['id'], // Fetch only the necessary fields
                });

                if (!parentCategory) {
                    return res.status(404).json({ message: `Category with id ${parent_id} does not exist` });
                }

                level = 2; // Level 2 for subcategories
            }

            const data = await getCategoryTreeOptimizedWithMap(parent_id, level);
            //    const data = await getCategoryTreeWithCTE(parent_id);
            res.status(200).json({ "data": data });
        }
        else if (include === 'ancestor') {
            // Get all ancestors of the specified category
            const ancestors = await fetchAncestorInfo(parent_id);
            res.status(200).json({ "data": ancestors });
        }
    }
    catch (error) {
        console.log('Error fetching category tree:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const fetchAncestorInfo = async (categoryId) => {
    const [results] = await sequelize.query(`
        WITH RECURSIVE ancestor_tree AS (
            SELECT id, parent_id, name, url_path
            FROM category
            WHERE id = :categoryId
            UNION ALL
            SELECT c.id, c.parent_id, c.name, c.url_path
            FROM category c
            INNER JOIN ancestor_tree at ON c.id = at.parent_id
        )
        SELECT id, name, url_path FROM ancestor_tree;
    `, { replacements: { categoryId } });

    return results;
};


const fetchAllCategoryIds = async (parentCategoryId) => {
    const [results] = await sequelize.query(`
        WITH RECURSIVE category_tree AS (
            SELECT id
            FROM category
            WHERE parent_id = :parentCategoryId
            UNION ALL
            SELECT c.id
            FROM category c
            INNER JOIN category_tree ct ON ct.id = c.parent_id
        )
        SELECT id FROM category_tree;
    `, { replacements: { parentCategoryId } });

    return results.map(result => result.id);
};

const fetchProducts = async (categoryIds, limit, offset, filters, sortOption) => {
    const where = {
        category_id: {
            [Op.in]: categoryIds,
        },
        inventory_status: 'available',
    };

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

    let order = [];
    switch (sortOption) {
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

    const products = await Product.findAll({
        where,
        order,
        limit,
        offset,
    });

    const count = await Product.count({ where });

    return {count, rows: products};
};

// GET /api/categories/listings?limit=20&category=0&page=1&sort=top_seller|default(popular)|newest|price,asc|price,des&rating=5,4&price=8000,4000000
const getProductsByCategory = async (req, res) => {
    const {
        limit = 20,
        page = 1,
        category: categoryId,
        sort = 'default',
        rating,
        price,
    } = req.query;
    
    const params = { limit, page, categoryId, sort, rating, price };

    // Parse limit and page as integers, fallback to default values if not invalid
    const parsedLimit = parseInt(limit, 10) || 20;
    const parsedPage = parseInt(page, 10) || 1;
    const offset = (parsedPage - 1) * parsedLimit;

    if (!categoryId) {
        return res.status(400).json({ message: 'Category ID is required' });
    }

    // Parse category ID as an integer
    const parsedCategoryId = parseInt(categoryId, 10);
    if (isNaN(parsedCategoryId)) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }

    // Parse rating filter
    const parsedRating = rating ? rating.split(',').map(r => parseInt(r, 10)).filter(r => !isNaN(r)) : null;

    // Parse price filter
    const parsedPrice = price ? price.split(',').map(p => parseInt(p, 10)).filter(p => !isNaN(p)) : null;

    if (parsedPrice  && parsedPrice.length !== 2) {
    //    console.log('Price filter must have 2 values');
        return res.status(400).json({ message: 'Price filter must have 2 values' });
    }

    try {
        const categoryIds = await fetchAllCategoryIds(parsedCategoryId);
        // Add the parent category ID to the list
        categoryIds.push(parsedCategoryId);
    //    console.log('Category IDs:', categoryIds);

        if (categoryIds.length === 0) {
            return res.status(200).json({ data: [], total: 0 });
        }

        const { count: total, rows: data } = await fetchProducts(
            categoryIds,
            parsedLimit,
            offset,
            { rating: parsedRating, price: parsedPrice },
            sort,
        );
        
        // Respond with pagination metadata and product data
        res.json({
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
        console.log('Error fetching products by category:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



module.exports = {
    getCategoryTree,
    getProductsByCategory,
};