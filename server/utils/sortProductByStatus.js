const sortProductByStatus = (products) => {
    products.sort((a, b) => {
        const statusPriority = {
            'pending': 1,
            'suspend': 2,
            'available': 3,
            'other': 4,
        };

        const aPriority = statusPriority[a.inventory_status] || statusPriority.other;
        const bPriority = statusPriority[b.inventory_status] || statusPriority.other;

        // Compare based on priority first
        if (aPriority !== bPriority) {
            return aPriority - bPriority;
        }

        // If priorities are the same, sort by creation date (descending)
        return new Date(b.created_at) - new Date(a.created_at);
    });
    return products;
};

module.exports = { sortProductByStatus };