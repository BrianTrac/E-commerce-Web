import { MoreVertical } from "lucide-react";

export const RecentOrdersTable = ({ orders = [] }) => {
    const formatVNDCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusStyle = (status) => {
        const statusStyles = {
            'paid': 'bg-green-50 text-green-600 border border-green-200',
            'pending': 'bg-yellow-50 text-yellow-600 border border-yellow-200',
            'failed': 'bg-red-50 text-red-600 border border-red-200',
            'processing': 'bg-blue-50 text-blue-600 border border-blue-200',
            'default': 'bg-gray-50 text-gray-600 border border-gray-200'
        };

        return statusStyles[status?.toLowerCase()] || statusStyles.default;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Hoá đơn gần đây</h3>
                    <p className="text-sm text-gray-500 mt-1">Danh sách đơn hàng mới nhất</p>
                </div>
                <button className="hover:bg-gray-100 p-2 rounded-full transition-colors duration-200">
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="pb-4 text-sm font-medium text-gray-500 text-left">Sản phẩm</th>
                            <th className="pb-4 text-sm font-medium text-gray-500 text-left">Thời gian</th>
                            <th className="pb-4 text-sm font-medium text-gray-500 text-left">Giá</th>
                            <th className="pb-4 text-sm font-medium text-gray-500 text-left">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders && orders.map((order, index) => (
                            <tr
                                key={order.id || index}
                                className="hover:bg-gray-50 transition-colors duration-200"
                            >
                                <td className="py-4">
                                    <div className="flex items-center space-x-3" style={{ maxWidth: '200px' }}>
                                        <div className="flex-shrink-0">
                                            <img
                                                src={order.product.thumbnail_url || '/api/placeholder/32/32'}
                                                alt={order.product.name}
                                                className="w-10 h-10 rounded-lg object-cover ring-1 ring-gray-100"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {order.product.name}
                                            </p>
                                            {order.product.sku && (
                                                <p className="text-xs text-gray-500">
                                                    SKU: {order.product.sku}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4">
                                    <div className="text-sm text-gray-900">
                                        {formatDate(order.updated_at)}
                                    </div>
                                </td>
                                <td className="py-4">
                                    <div className="text-sm font-medium text-gray-900 text-right">
                                        {formatVNDCurrency(order.product.price)}
                                    </div>
                                </td>
                                <td className="py-4">
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(order.order.status)}`}>
                                        {order.order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {(!orders || orders.length === 0) && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">Chưa có dữ liệu đơn hàng</p>
                    </div>
                )}
            </div>
        </div>
    );
};