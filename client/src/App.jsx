import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/user/RegisterPage.jsx";
import Login from "./pages/user/LoginPage.jsx";
import Home from "./pages/user/HomePage.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import MissingPage from "./pages/MissingPage.jsx";
import RequireAuth from "./hooks/RequireAuth";
import Shop from "./pages/shop/ShopPage.jsx";
import PersistLogin from "./hooks/PersistLogin";
import OTPVerification from "./pages/user/OTPVerificationPage.jsx";
import ForgetPassword from "./pages/user/ForgetPasswordPage.jsx";
import ResetPassword from "./pages/user/ResetPasswordPage.jsx";
import GoogleAuthHandler from './pages/user/GoogleAuthHandlerPage.jsx';
import Search from "./pages/user/SearchPage.jsx";
import CategoryWithProducts from "./components/user/CategoryWithProducts.jsx";
import ProductDetails from "./components/user/ProductDetails.jsx";

// Admin page components
import AdminDashboard from "./pages/admin/DashboardPage.jsx";
import RoleManagement from "./pages/admin/RoleManagementPage.jsx";
import UserManagement from "./pages/admin/UserManagementPage.jsx";
import SellerManagement from "./pages/admin/SellerManagementPage.jsx";
import SellerDetailPage from "./pages/admin/SellerDetailPage.jsx";
import SellerProductPage from "./pages/admin/SellerWithProductPage.jsx";

const ROLES = {
    User: 'User',
    Shop: 'Shop',
    Admin: 'Admin',
}

const App = () => {
    return (
        <Routes>
            <Route element={<PersistLogin />}>
                {/* USER ROUTE */}
                <Route path="/" element={<UserLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/search/:keyword" element={<Search />} />
                    <Route path="/:url_key/:id" element={<CategoryWithProducts />} />
                    <Route path="/:url_key" element={<ProductDetails />} />
                </Route>

                {/* ADMIN ROUTES */}
                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        {/* Redirect to /admin/dashboards */}
                        <Route index element={<Navigate to="/admin/dashboards" replace />} />
                        {/* Admin Dashboards */}
                        <Route path="dashboards" element={<AdminDashboard />} />
                        {/* Role Management */}
                        <Route path="role-management" element={<RoleManagement />} />
                        {/* User Management */}
                        <Route path="user-management" element={<UserManagement />} />
                        {/* Seller Management */}
                        <Route path="seller-management">
                            <Route index element={<SellerManagement />} />
                            <Route path=":id" element={<SellerDetailPage />} />
                            <Route path=":id/products" element={<SellerProductPage />} />
                        </Route>
                    </Route>
                </Route>


                {/* SHOP ROUTE */}
                <Route element={<RequireAuth allowedRoles={[ROLES.Shop]} />}>
                    <Route path="/Shop" element={<Shop />} />
                </Route>
            </Route>

            {/* AUTH ROUTES */}
            <Route path="/auth" element={<AuthLayout />}>
                <Route index element={<Navigate to="/auth/login" replace />} />
                <Route path="login" element={<Login />} state={{ title: "Login" }} />
                <Route path="register" element={<Register />} state={{ title: "Register" }} />
            </Route>
            <Route path="/auth/forget-password" element={<ForgetPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/register/verify-otp" element={<OTPVerification />} />
            <Route path="/auth/google/callback" element={<GoogleAuthHandler />} />

            {/* ERROR PAGES */}
            <Route path="unauthorized" element={<MissingPage />} /> {/* 403 Page */}
            <Route path="*" element={<MissingPage />} /> {/* 404 Page */}
        </Routes>
    );
};

export default App;