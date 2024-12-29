const Category = require('../../models/Category');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['name'], 
      limit: 20,           
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = {
  getAllCategories,
};
