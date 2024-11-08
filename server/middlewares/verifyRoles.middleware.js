const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.roles) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role => rolesArray.includes(role).find(val => val === true));

        if (!result) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    };

};

module.exports = verifyRoles;