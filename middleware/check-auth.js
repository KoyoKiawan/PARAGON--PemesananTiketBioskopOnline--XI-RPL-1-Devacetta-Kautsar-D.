const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: "Access Denied! No token provided." });
        }

        const token = req.headers.authorization.split(" ")[1]; // Extract token
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        
        // Check if the user is an admin
        if (decodedToken.role !== "admin") {
            return res.status(403).json({ message: "Forbidden! Only admins can perform this action." });
        }

        req.userData = decodedToken; // Store user data in request
        next(); // Continue to the next middleware

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token provided!",
            error: error.message
        });
    }
}

function checkUserAuth(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: "Access Denied! No token provided." });
        }

        const token = req.headers.authorization.split(" ")[1]; // Extract token
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);

        

        req.userData = decodedToken; // Store user data in request
        next(); // Continue to the next middleware

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token provided!",
            error: error.message
        });
    }
}


module.exports = {
    checkAuth,
    checkUserAuth
};
