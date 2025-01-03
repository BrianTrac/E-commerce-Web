const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    // // routes don't need authentication
    // const skipRoutes = ['/api/seller/product'];
    // // console.log("Current route:", req.path);  // In ra route hiện tại

    // if (skipRoutes.some(route => new RegExp(route.replace(/:\w+/g, '\\w+')).test(req.path))) {
    //     console.log("Skipping authentication for route:", req.path);  // In ra nếu route này bỏ qua xác thực
    //     return next(); 
    // }

    const authHeader = req.headers.authorization;
    console.log('authHeader:', authHeader);
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: `Forbidden: ${err.message}` });
            }

            req.user = {
                id: decoded.id,
                role: decoded.role,
            }
            console.log('req.user:', req.user);  // In ra thông tin user
            next();
        });
};

module.exports = verifyJWT;
