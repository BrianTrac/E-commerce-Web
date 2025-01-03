import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MoreVertical } from "lucide-react";
import { Card } from "antd";

export const UserGrowthOverview = ({ userGrowth }) => {
    const data = userGrowth?.data || [];
    debugger;
    const enrichedData = data.map((d, i) => ({
        ...d,
        totalRegistered: data.slice(0, i + 1).reduce((sum, entry) => sum + entry.newUsers, 0),
    }));
    const totalUsers = enrichedData.reduce((acc, curr) => acc + curr.newUsers, 0);
    const lastMonthGrowth = data.length > 1
        ? ((enrichedData[enrichedData.length - 1].newUsers - enrichedData[enrichedData.length - 2].newUsers)
            / enrichedData[enrichedData.length - 2].newUsers * 100).toFixed(1)
        : "0";

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload?.length) {
            const { totalRegistered } = payload[0].payload;
            return (
                <div style={{
                    padding: '8px',
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>{label}</p>
                    <p>Tổng số người dùng: {totalRegistered}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card style={{ width: '100%', minHeight: '500px', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                borderBottom: '1px solid #E5E7EB',
                paddingBottom: '12px',
            }}>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Phân tích tăng trưởng người dùng</h3>
                    <p className="text-sm text-gray-500 mt-1">Số liệu người dùng hàng tháng</p>
                </div>
                <MoreVertical size={16} style={{ color: '#9CA3AF', cursor: 'pointer' }} />
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                marginBottom: '24px',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Tổng số người dùng</p>
                    <p style={{ fontSize: '1.25rem', color: '#3b82f6' }}>{totalUsers.toLocaleString()}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Tăng trưởng tháng</p>
                    <p style={{ fontSize: '1.25rem', color: '#8b5cf6' }}>{lastMonthGrowth}%</p>
                </div>
            </div>
            <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="95%" height="100%">
                    <LineChart
                        data={enrichedData}
                        margin={{ top: 20, right: 50, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{
                                top: -10,
                                left: 0,
                                fontSize: '0.85rem',
                                color: '#4B5563',
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="totalRegistered"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            name="Tổng số người dùng" 
                        />
                        <Line
                            type="monotone"
                            dataKey="newUsers"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            name="Người dùng mới"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default UserGrowthOverview;
