// import { Outlet, useLocation, Navigate } from "react-router-dom";
// //import useAuth from "./useAuth";
// import { useSelector } from "react-redux";
// import { selectAuth } from "../redux/reducers/user/authReducer";

// const RequireAuth = ({ allowedRoles }) => {
//     const { user } = useSelector(selectAuth);
//     const location = useLocation();
//     const auth = user;

//     // Ensure `auth.role` is an array, or convert it to an array if it's a single value
//     const roles = Array.isArray(auth?.role) ? auth.role : [auth?.role];

//     const isAuthorized = roles.some(role => allowedRoles.includes(role));
//     return (
//         <Outlet />
//         // isAuthorized ? (
//         //     <Outlet />
//         // ) : auth?.accessToken ? (
//         //     // Redirect to the unauthorized page if authenticated but lacking the required role
//         //     <Navigate to="/unauthorized" state={{ from: location }} replace />
//         // ) : (
//         //     // Redirect to login if not authenticated
//         //     <Navigate to="/auth/login" state={{ from: location }} replace />
//         // )
//     );
// };

// export default RequireAuth;

import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../redux/reducers/user/authReducer";

const RequireAuth = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useSelector(selectAuth); // Check authentication state
    const location = useLocation();

    // Ensure `user.role` is an array or wrap it in an array if it's a single value
    const roles = Array.isArray(user?.role) ? user.role : [user?.role];

    // Check if the user is authorized based on their roles
    const isAuthorized = roles.some((role) => allowedRoles.includes(role));

    if (!isAuthenticated) {
        // Redirect unauthenticated users to the login page
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (!isAuthorized) {
        // Redirect authenticated users without proper roles to the unauthorized page
        return <Navigate to="/notfound" state={{ from: location }} replace />;
    }

    // If authenticated and authorized, render child routes
    return <Outlet />;
};

export default RequireAuth;
