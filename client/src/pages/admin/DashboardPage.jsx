import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecentOrders, fetchRecentCustomers, fetchTopSellers, fetchUserGrowth } from '../../redux/actions/admin/salesAnalyticsAction';
import { selectRecentOrders, selectRecentCustomers, selectTopSellers, selectUserGrowth } from '../../redux/reducers/admin/salesAnalyticsReducer';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
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

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-semibold">Dashboards</h2>
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