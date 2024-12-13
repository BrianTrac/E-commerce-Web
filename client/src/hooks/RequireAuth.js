import { Outlet, useLocation, Navigate } from "react-router-dom";
//import useAuth from "./useAuth";
import { useSelector } from "react-redux";
import { selectAuth } from "../redux/reducers/user/authReducer";

const RequireAuth = ({ allowedRoles }) => {
    const {user} =  useSelector(selectAuth);
    const location = useLocation();
    const auth = user;

    // Ensure `auth.role` is an array, or convert it to an array if it's a single value
    const roles = Array.isArray(auth?.role) ? auth.role : [auth?.role];

    const isAuthorized = roles.some(role => allowedRoles.includes(role));

    return (
        isAuthorized ? (
            <Outlet />
        ) : auth?.accessToken ? (
            // Redirect to the unauthorized page if authenticated but lacking the required role
            <Navigate to="/unauthorized" state={{ from: location }} replace />
        ) : (
            // Redirect to login if not authenticated
            <Navigate to="/auth/login" state={{ from: location }} replace />
        )
    );
};

export default RequireAuth;
