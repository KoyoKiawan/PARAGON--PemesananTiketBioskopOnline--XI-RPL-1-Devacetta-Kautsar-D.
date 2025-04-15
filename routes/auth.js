const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/refresh", (req, res) => {
    const refreshToken = req.cookies.refreshToken; // 🔥 Get refresh token from HTTP-only cookie

    if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized. No refresh token provided." });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid refresh token." });
        }

        // Generate a new access token
        const newAccessToken = jwt.sign(
            { userId: decoded.userId, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: "15m" } // Short-lived access token
        );

        res.json({ token: newAccessToken });
    });
});

module.exports = router;
