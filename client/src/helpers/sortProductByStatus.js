export const sortProductByStatus = (products) => {
    products.sort((a, b) => {
        const statusPriority = {
            pending: 1,
            suspend: 2,
            other: 3,
        };

        const aPriority = statusPriority[a.inventory_status] || statusPriority.other;
        const bPriority = statusPriority[b.inventory_status] || statusPriority.other;
        if (aPriority !== bPriority) {
            return aPriority - bPriority;
        }

        return new Date(b.created_at) - new Date(a.created_at);
    });
    return products;
};