const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if req.user exists and has a role property
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Forbidden!' });
        }

        // Check if the user's role matches one of the allowed roles
        const rolesArray = [...allowedRoles];
        //    console.log('rolesArray:', rolesArray);
        const hasPermission = rolesArray.includes(req.user.role);

        if (!hasPermission) {
            return res.status(403).json({ message: 'Forbidden!' });
        }
    //    console.log('hasPermission:', hasPermission);
        return next();
    };
};

module.exports = verifyRoles;
