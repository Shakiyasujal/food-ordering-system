import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
    // Get token from cookies or Authorization header
    const token = req.cookies?.token || (
        req.headers.authorization && req.headers.authorization.split(' ')[1]
    )

    if (!token) {
        return res.status(401).json({ success: false, message: "Token Missing" })
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Add user ID to request object
        req.user = {
            _id: decoded.id,
            email: decoded.email
        }

        // Continue to next middleware/route
        next()

    } catch (error) {
        const message = error.name === 'TokenExpiredErro' ? 'Token expired' : 'Invalid Token';
        res.status(403).json({
            success: false, message
        })
    }
}

export default authMiddleware