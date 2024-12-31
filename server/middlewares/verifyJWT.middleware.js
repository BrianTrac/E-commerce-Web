const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    // // routes don't need authentication
    // const skipRoutes = ['/api/seller/product'];
    // // console.log("Current route:", req.path);  // In ra route hiện tại

    // if (skipRoutes.some(route => new RegExp(route.replace(/:\w+/g, '\\w+')).test(req.path))) {
    //     console.log("Skipping authentication for route:", req.path);  // In ra nếu route này bỏ qua xác thực
    //     return next(); 
    // }

    next();



    // const authHeader = req.headers.authorization;
    // if (!authHeader?.startsWith('Bearer ')) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                console.error('JWT Verification Error:', err.message);
                return res.status(403).json({ message: 'Forbidden' });
            }

            console.log('Decoded token:', decoded);  // Xem payload của token

            req.user = {
                id: decoded.id,
                role: decoded.role,
            }
            next();
    });
};

module.exports = verifyJWT;