// Middleware to check if user is logged in
const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({
            success: false,
            message: 'Please login first'
        });
    }
    next();
};

module.exports = { requireLogin };