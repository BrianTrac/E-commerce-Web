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
        console.log('Allow Roles: ', allowedRoles);
        // navigate /auth/login?type=allowedRoles[0]
        return <Navigate 
                    to={`/auth/login?type=${(allowedRoles[0]).toLowerCase() || 'user'}`} 
                    state={{ from: location }} 
                    replace 
                />
    }

    if (!isAuthorized) {
        // Redirect authenticated users without proper roles to the unauthorized page
        return <Navigate to="/notfound" state={{ from: location }} replace />;
    }

    // If authenticated and authorized, render child routes
    return <Outlet />;
};

export default RequireAuth;
