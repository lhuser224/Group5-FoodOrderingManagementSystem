const jwt = require('jsonwebtoken');

const authMiddleware = {
  verifyToken: (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
        data: null
      });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token',
          data: null
        });
      }

      req.user = decoded;
      next();
    });
  },

  isCustomer: (req, res, next) => {
    if (req.user.role !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Customer role required',
        data: null
      });
    }
    next();
  },

  isSeller: (req, res, next) => {
    if (req.user.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Seller role required',
        data: null
      });
    }
    next();
  },

  isAdmin: (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required',
        data: null
      });
    }
    next();
  }
};

module.exports = authMiddleware;
