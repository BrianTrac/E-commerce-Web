const database = require('../config/firebaseConfig');
const { ref, push } = require('firebase/database');

const addNotification = async (sellerId, productName) => {
    const notificationsRef = ref(database, 'notifications/');
    const newNotification = {
        sellerId,
        productName,
        message: `Seller ${sellerId} vừa thêm sản phẩm ${productName}.`,
        timestamp: new Date().toISOString(),
    };

    await push(notificationsRef, newNotification);
};

module.exports = { addNotification };
