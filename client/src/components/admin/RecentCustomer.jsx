import { MoreVertical } from "lucide-react";

export const RecentCustomerList = ({ customers = [] }) => {
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

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Khách hàng gần đây</h3>
                    <p className="text-sm text-gray-500 mt-1">Danh sách khách hàng mới nhất</p>
                </div>
                <button className="hover:bg-gray-100 p-2 rounded-full transition-colors duration-200">
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            <div className="space-y-5">
                {customers && customers.map((customer, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <img
                                    src={customer.image || 'https://placehold.co/40'}
                                    alt={`${customer.username}'s avatar`}
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                                />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900">{customer.username}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs text-gray-500">ID #{customer.id}</span>
                                    {customer.lastOrder && (
                                        <>
                                            <span className="text-xs text-gray-300">•</span>
                                            <span className="text-xs text-gray-500">
                                                Đơn hàng cuối: {customer.lastOrder}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(customer.order_status)}`}>
                            {customer.order_status}
                        </span>
                    </div>
                ))}

                {(!customers || customers.length === 0) && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">Chưa có dữ liệu khách hàng</p>
                    </div>
                )}
            </div>
        </div>
    );
};