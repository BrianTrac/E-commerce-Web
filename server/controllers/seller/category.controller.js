const Category = require('../../models/Category');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || ''; // Lấy từ khóa tìm kiếm

    // Tìm danh mục có tên bắt đầu với từ khóa nhập vào
    const { count, rows } = await Category.findAndCountAll({
      attributes: ['id', 'name'],
      where: {
        name: {
          [Op.iLike]: `${search}%`, // Tìm kiếm những category_name bắt đầu với từ khóa
        },
      },
      limit,
      offset,
    });

    res.status(200).json({
      data: rows,
      total: count,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllCategories,
};
