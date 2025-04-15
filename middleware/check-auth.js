const jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access Denied! No token provided or invalid format." });
        }

        const token = authHeader.split(" ")[1]; // Extract token
        console.log("🔍 Token received in backend:", token); // ✅ Debugging

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ message: "Invalid token structure." });
        }

        if (decodedToken.role !== "admin") {
            return res.status(403).json({ message: "❌ Forbidden! Only admins can perform this action." });
        }

        req.userData = decodedToken;
        next(); // Proceed to next middleware

    } catch (error) {
        console.error("❌ JWT Verification Error:", error.message); // ✅ Debugging

        let errorMessage = "Invalid or expired token!";
        if (error.name === "TokenExpiredError") {
            errorMessage = "Token expired, please refresh"; // 🔥 Important for refresh logic
        } else if (error.name === "JsonWebTokenError") {
            errorMessage = "Invalid token provided!";
        }

        return res.status(401).json({ message: errorMessage });
    }
}

function checkUserAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access Denied! No token provided." });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken || !decodedToken.id) {
            return res.status(403).json({ message: "Invalid token structure." });
        }

        req.user = decodedToken; // ✅ Set as req.user so it's accessible in controllers
        next();

    } catch (error) {
        console.error("❌ JWT Verification Error:", error.message);

        let errorMessage = "Invalid or expired token!";
        if (error.name === "TokenExpiredError") {
            errorMessage = "Token expired, please refresh";
        } else if (error.name === "JsonWebTokenError") {
            errorMessage = "Invalid token provided!";
        }

        return res.status(401).json({ message: errorMessage });
    }
}

module.exports = { checkAuth, checkUserAuth };
