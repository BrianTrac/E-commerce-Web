import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import MissingPage from "./pages/MissingPage.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./hooks/RequireAuth";
import Admin from "./pages/Admin";
import Seller from "./pages/Seller";
import PersistLogin from "./hooks/PersistLogin";
import EmailVerification from "./components/EmailVerification.jsx";
import ForgetPassword from "./components/ForgetPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import GoogleAuthHandler from './components/GoogleAuthHandler';


const ROLES = {
    'User':1236,
    'Seller':1235,
    'Admin':1234,
}

const App = () => {
    return (     
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
            </Route>
            
            <Route element={<PersistLogin />}>
                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                    <Route path="/Admin" element={<Admin/>} />
                </Route>
                <Route element={<RequireAuth allowedRoles={[ROLES.Seller]} />}>
                    <Route path="/Seller" element={<Seller/>} />
                </Route>
            </Route>

            <Route path="/auth" element={<AuthLayout />}>
                <Route index element={<Navigate to="/auth/login" replace />} />
                <Route path="login" element={<Login />} state={{ title: "Login" }} />
                <Route path="register" element={<Register />} state={{ title: "Register" }} />
            </Route>

            <Route path="/auth/forget-password" element={<ForgetPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/verify-email" element={<EmailVerification />}/>
            <Route path="/auth/google/callback" element={<GoogleAuthHandler />} />
            
            <Route path="unauthorized" element={<MissingPage />} /> {/* 403 Page */}
            
            <Route path="*" element={<MissingPage />} /> {/* 404 Page */}
        </Routes>
    );
};

export default App;