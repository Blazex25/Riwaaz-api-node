const jwtProvider = require("../config/jwtProvider");
const userService = require("../services/user.service");

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header missing." });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token not found." });
        }

        const userId = jwtProvider.getUserIdFromToken(token);
        if (!userId) {
            return res.status(401).json({ message: "Invalid token." });
        }

        const user = await userService.findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication failed.", error: error.message });
    }
};

module.exports = authenticate;
