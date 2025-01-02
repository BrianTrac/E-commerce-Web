import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecentOrders, fetchRecentCustomers, fetchTopSellers, fetchUserGrowth } from '../../redux/actions/admin/salesAnalyticsAction';
import { selectRecentOrders, selectRecentCustomers, selectTopSellers, selectUserGrowth } from '../../redux/reducers/admin/salesAnalyticsReducer';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { ShoppingCart, DollarSign, Calendar, CreditCard } from 'lucide-react';
import { StatsCard } from '../../components/admin/StatsCard';
import { RecentOrdersTable } from '../../components/admin/RecentOrdersTable';
import { UserGrowthOverview } from '../../components/admin/UserGrowthOverview';
import { RecentCustomerList } from '../../components/admin/RecentCustomer';
import { TopSellers } from '../../components/admin/TopSellers';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();
    const recentOrders = useSelector(selectRecentOrders);
    const recentCustomers = useSelector(selectRecentCustomers);
    const topSellers = useSelector(selectTopSellers);
    const userGrowth = useSelector(selectUserGrowth);

    useEffect(() => {
        dispatch(fetchRecentOrders({ axiosInstance: axiosPrivate, limit: 10 }));
        dispatch(fetchRecentCustomers({ axiosInstance: axiosPrivate, limit: 10 }));
        dispatch(fetchTopSellers({ axiosInstance: axiosPrivate, limit: 10 }));
        dispatch(fetchUserGrowth({ axiosInstance: axiosPrivate }));
    }, [dispatch, axiosPrivate]);

    const statsCards = [
        {
            icon: DollarSign,
            iconBgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
            value: '12,463',
            comparison: 'Compared to Jan 2024',
            lineColor: '#8884d8'
        },
        {
            icon: ShoppingCart,
            iconBgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
            value: '3,456',
            comparison: 'Compared to Jan 2024',
            lineColor: '#82ca9d'
        },
        {
            icon: Calendar,
            iconBgColor: 'bg-green-100',
            iconColor: 'text-green-600',
            value: '1,234',
            comparison: 'Compared to Jan 2024',
            lineColor: '#ffc658'
        },
        {
            icon: CreditCard,
            iconBgColor: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            value: '5,678',
            comparison: 'Compared to Jan 2024',
            lineColor: '#8884d8'
        }
    ];

    const lineChartData = [
        { name: 'Jan', value: 100 },
        { name: 'Feb', value: 120 },
        { name: 'Mar', value: 90 },
        { name: 'Apr', value: 140 },
        { name: 'May', value: 110 },
        { name: 'Jun', value: 130 },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-semibold">Dashboards</h2>
                </div>

                <div className="grid grid-cols-4 gap-6 mb-8">
                    {statsCards.map((card, index) => (
                        <StatsCard key={index} {...card} data={lineChartData} />
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <RecentOrdersTable orders={recentOrders.data} />
                    <UserGrowthOverview userGrowth={userGrowth} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <RecentCustomerList customers={recentCustomers.data} />
                    <TopSellers sellers={topSellers.data} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;