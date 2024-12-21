// const verifyRoles = (...allowedRoles) => {
//     return (req, res, next) => {
//         if (!req.roles) {
//             console.log('Access denied: Missing roles information', req.roles);
//             return res.status(403).json({ message: 'Forbidden' });
//         }

//         const rolesArray = [...allowedRoles];
//         const result = req.roles.map(role => rolesArray.includes(role).find(val => val === true));

//         if (!result) {
//             console.log('Access denied: Roles do not match allowed roles', req.roles);
//             return res.status(403).json({ message: 'Forbidden' });
//         }

//         next();
//     };

// };

// module.exports = verifyRoles;


// OLD CODE

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            console.log('Access denied: Missing information', req.user.role);
            return res.status(403).json({ message: 'Forbidden' });
        }

        const rolesArray = [...allowedRoles];
        // One user can have only one roles
        const result = rolesArray.includes(req.user.role);

        if (!result) {
            console.log('Access denied: Roles do not match allowed roles', req.roles);
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    };

};

module.exports = verifyRoles;