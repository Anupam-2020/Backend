const jwt = require('jsonwebtoken');

const authMiddleware = (req, resp, next) => {
    try {
        const authHeader = req.headers.authorization; // Get the Authorization header from the request.
        if(!authHeader || !authHeader.startsWith('Bearer')) {
            return resp.status(401).json({
                message: 'Authorization token missing'
            });
        }

        const token = authHeader.split(' ')[1]; // Extract the token from the header (assuming format "Bearer <token>").
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key. If the token is invalid or expired, this will throw an error.

        req.user = {
            userId: decoded.userId
        }
        next(); // Pass control to the next middleware or route handler.
    } catch(error) {
        return resp.status(401).json({
            message: 'Invalid or expired token'
        });
    }
}

module.exports = authMiddleware;