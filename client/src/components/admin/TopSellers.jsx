import { MoreVertical } from "lucide-react";

const formatVNDCurrency = (amount) => {
    amount = Number(amount);
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

export const TopSellers = ({ sellers = [] }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Cửa hàng bán chạy nhất</h3>
                </div>
                <button className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-gray-100">
                            <th className="pb-4 text-sm font-medium text-gray-500">ID</th>
                            <th className="pb-4 text-sm font-medium text-gray-500">Tên cửa hàng</th>
                            <th className="pb-4 text-sm font-medium text-right text-gray-500">Tổng số lượt bán</th>
                            <th className="pb-4 text-sm font-medium text-right text-gray-500">Doanh thu</th>
                            <th className="pb-4 text-sm font-medium text-right text-gray-500">Tiền lời</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {sellers && sellers.map((seller, index) => (
                            <tr
                                key={seller.store_id || index}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-4 text-sm text-gray-600">
                                    #{seller.store_id}
                                </td>
                                <td className="py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={seller.icon || '/api/placeholder/32/32'}
                                                alt={`${seller.name}'s store`}
                                                className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{seller.name}</p>
                                            <p className="text-xs text-gray-500">{seller.category || 'General'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4">
                                    <div className="text-sm text-right font-medium text-gray-900">
                                        {seller.total_sold.toLocaleString('vi-VN')}
                                    </div>
                                    <div className="text-xs text-right text-gray-500">sản phẩm</div>
                                </td>
                                <td className="py-4">
                                    <div className="text-sm text-right font-medium text-gray-900">
                                        {formatVNDCurrency(seller.total_sale)}
                                    </div>
                                    <div className="text-xs text-right text-gray-500">doanh thu</div>
                                </td>
                                <td className="py-4">
                                    <div className="text-sm text-right font-medium text-emerald-600">
                                        {formatVNDCurrency(seller.earnings)}
                                    </div>
                                    <div className="text-xs text-right text-gray-500">lợi nhuận</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {(!sellers || sellers.length === 0) && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">Chưa có dữ liệu người bán</p>
                    </div>
                )}
            </div>
        </div>
    );
};