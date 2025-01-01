const Seller = require('../../models/Seller');

const getStore = async (req, res) => {
    try {
        const seller_id = req.user?.id || 11;  // Use default seller ID if not available

        let store = await Seller.findOne({
            where: {
                user_id: seller_id
            }
        });

        if (!store) {
            // Generate a unique store_id
            let store_id;
            let storeExists = true;
            
            // Loop to generate a unique store_id
            while (storeExists) {
                store_id = Math.floor(Math.random() * 1000000);  // Generate random store_id (you can adjust the range as needed)
                
                // Check if store_id already exists
                const existingStore = await Seller.findOne({ where: { store_id } });
                if (!existingStore) {
                    storeExists = false;  // If no store exists with the same store_id, exit the loop
                }
            }

            // Create a new store with default values
            store = await Seller.create({
                user_id: seller_id,
                name: '',  
                avg_rating_point: 0,        
                icon: '',  
                info: {},  
                review_count: 0,       
                store_id,                 
                total_follower: 0,        
                url: '',    
                is_official: false,        
            });
        }

        res.status(200).json(store);  // Return the store information

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

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