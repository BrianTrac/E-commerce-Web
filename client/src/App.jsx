import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/user/RegisterPage.jsx";
import Login from "./pages/user/LoginPage.jsx";
import Home from "./pages/user/HomePage.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import AuthLayout from "./layouts/AuthLayout";
import SellerLayout from "./layouts/SellerLayout.jsx";
import MissingPage from "./pages/MissingPage.jsx";
import RequireAuth from "./hooks/RequireAuth";
import Admin from "./pages/admin/AdminPage.jsx";
import PersistLogin from "./hooks/PersistLogin";
import OTPVerification from "./pages/user/OTPVerificationPage.jsx";
import ForgetPassword from "./pages/user/ForgetPasswordPage.jsx";
import ResetPassword from "./pages/user/ResetPasswordPage.jsx";
import GoogleAuthHandler from './pages/user/GoogleAuthHandlerPage.jsx';
import Search from "./pages/user/SearchPage.jsx";
import Category from "./components/user/Category.jsx";
import CategoryWithProducts from "./components/user/CategoryWithProducts.jsx";
import ProductDetails from "./components/user/ProductDetails.jsx";


// Seller page components
import SellerDashboard from "./pages/seller/SellerDashboard.jsx";
import SellerProductManagement from "./pages/seller/SellerProductManagement.jsx";
import SellerProductDetail from "./pages/seller/SellerProductDetail.jsx";
import SellerAddProduct from "./pages/seller/SellerAddProduct.jsx";
import SellerVoucher from "./pages/seller/SellerVoucher.jsx";
import SellerEditProduct from "./pages/seller/SellerEditProduct.jsx";
import SellerInfo from "./pages/seller/SellerInfo.jsx";

const ROLES = {
    User: 'User',
    Seller: 'Seller',
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

                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                    <Route path="/Admin" element={<Admin />} />
                </Route>
                
                {/* SELLER ROUTE */}
                <Route element={<RequireAuth allowedRoles={[ROLES.Seller]} />}>
                    <Route path="/seller" element={<SellerLayout/>}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route index path="dashboard" element={<SellerDashboard />} />
                        <Route path="product-management">
                            <Route index element={<SellerProductManagement />} />
                            <Route path="detail/:productId" element={<SellerProductDetail />} />
                            <Route path="add" element={<SellerAddProduct />} />
                            <Route path="edit/:productId" element={<SellerEditProduct />} />
                        </Route>
                        
                        <Route path="voucher" element={<SellerVoucher />} />
                        <Route path="info" element={<SellerInfo />} />
                    </Route>
                </Route>
            </Route>

            {/* AUTH ROUTE */}
            <Route path="/auth" element={<AuthLayout />}>
                <Route index element={<Navigate to="/auth/login" replace />} />
                <Route path="login" element={<Login />} state={{ title: "Login" }} />
                <Route path="register" element={<Register />} state={{ title: "Register" }} />
            </Route>
            <Route path="/auth/forget-password" element={<ForgetPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/register/verify-otp" element={<OTPVerification />} />
            <Route path="/auth/google/callback" element={<GoogleAuthHandler />} />


            <Route path="unauthorized" element={<MissingPage />} /> {/* 403 Page */}

            <Route path="*" element={<MissingPage />} /> {/* 404 Page */}
        </Routes>
    );
};

export default App;