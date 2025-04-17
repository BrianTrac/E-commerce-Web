const express = require('express');
const router = express.Router();
const axios = require('axios');

// Proxy endpoint for Tiki reviews
router.get('/', async (req, res) => {
    try {
      const productId = req.query.product_id;
      if (!productId) {
        return res.status(400).json({ error: 'product_id is required' });
      }
      
      const response = await axios.get(
        `https://tiki.vn/api/v2/reviews?product_id=${productId}`
        );
        
        console.log('Response data:', response.data);
      
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Proxy error:', error.message);
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to fetch from Tiki API',
        details: error.message
      });
    }
  });
module.exports = router;