const Seller = require('../../models/Seller');

const getStore = async (req, res) => {
    try { 
      const seller_id = req.user?.id || 11;

      const store = await Seller.findOne({
          where: {
              user_id: seller_id
          }
      });

      if (!store) {
          return res.status(404).json({ message: 'Store not found' });
      }

      res.status(200).json(store);
      
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateStore = async (req, res) => {
    try {
        const seller_id = req.user?.id || 11;

        const store = await Seller.findOne({
            where: {
                user_id: seller_id
            }
        });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        await store.update(req.body);

        res.status(200).json({ message: 'Store updated' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
  getStore,
  updateStore
};