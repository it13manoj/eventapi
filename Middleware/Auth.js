const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {

        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                status: 401,
                message: "Token required"
            });
        }

        const bearer = token.split(" ");

        const decoded = jwt.verify(bearer[1], process.env.SECERET_KEY);

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            status: 401,
            message: "Invalid token",
            error: error.message
        });

    }
};

module.exports = auth;