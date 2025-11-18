import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT token and authenticate user
 * Adds user info to req.user if token is valid
 */
export const authenticateToken = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: 'Token has expired' });
                }
                if (err.name === 'JsonWebTokenError') {
                    return res.status(401).json({ error: 'Invalid token' });
                }
                return res.status(403).json({ error: 'Token verification failed' });
            }

            // Attach decoded user info to request object
            req.user = decoded;
            next();
        });
    } catch (error) {
        res.status(500).json({ error: 'Authentication error', details: error.message });
    }
};

/**
 * Optional middleware - checks if user is authenticated but doesn't fail if not
 * Useful for routes that work both with and without authentication
 */
export const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (!err) {
                    req.user = decoded;
                }
            });
        }
        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};

