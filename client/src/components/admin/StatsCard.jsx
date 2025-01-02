import { LineChart, Line } from 'recharts';
import { MoreVertical } from 'lucide-react';

export const StatsCard = ({ icon: Icon, iconBgColor, iconColor, value, comparison, data, lineColor }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 ${iconBgColor} rounded-full`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <MoreVertical className="w-4 h-4 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{value}</h3>
            <p className="text-sm text-gray-500">{comparison}</p>
            <div className="mt-4">
                <LineChart width={200} height={60} data={data}>
                    <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2} dot={false} />
                </LineChart>
            </div>
        </div>
    );
};
