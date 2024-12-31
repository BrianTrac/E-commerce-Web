const database = require('../config/firebaseConfig');
const { ref, push } = require('firebase/database');

const addNotification = async (storeId, productName) => {
  const notificationsRef = ref(database, 'notifications');
  const newNotification = {
    storeId,
    productName,
    message: `Seller ${storeId} vừa thêm sản phẩm ${productName}`,
    timestamp: new Date().toISOString(),
  }
  await push(notificationsRef, newNotification);
}

module.exports = { addNotification };