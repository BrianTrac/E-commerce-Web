import { Outlet, useLocation, Navigate } from "react-router-dom";
import useAuth from "./useAuth";

const RequireAuth = ({allowedRoles}) => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.role?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.accessToken
                ? <Navigate to="unauthorized" state={{ from: location }} replace />
                : <Navigate to="auth/login" state={{ from: location }} replace />
    );
};

export default RequireAuth;