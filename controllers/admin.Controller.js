const models = require('../models');
const jwt = require('jsonwebtoken');


function adminAuth(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access denied! No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Access denied! Admins only." });
        }

        req.user = decoded; 
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token!" });
    }
}


function dashboard(req, res) {
    res.status(200).json({ message: "Welcome to the Admin Dashboard!", admin: req.user.username });
}

module.exports = {
    adminAuth,
    dashboard
};
