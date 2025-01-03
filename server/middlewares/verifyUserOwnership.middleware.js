const verifyUserOwnership = async (req, res, next) => {
    const userIdFromToken = parseInt(req.user.id);
    const roleFromToken = req.user.role;
    const userIdFromParams = parseInt(req.params.id);

    if (roleFromToken === 'Admin') {
        return next();
    }

    if (userIdFromToken === userIdFromParams) {
        return next();
    }
    
    return res.status(403).json({ message: 'Access denied: You can only access your own account.' });
};

module.exports = verifyUserOwnership;