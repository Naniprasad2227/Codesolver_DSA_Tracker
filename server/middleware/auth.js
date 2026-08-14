const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Authentication required. Please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'codesolver_jwt_secret_key_change_in_production_2024');
    req.userId = decoded.id;
    req.user = decoded;

    // Check user in database to ensure role is up-to-date
    const userDoc = await User.findById(decoded.id).select('name email role');
    if (!userDoc) {
      return res.status(401).json({ message: 'User account no longer exists.' });
    }
    req.userRole = userDoc.role || 'user';
    req.userDoc = userDoc;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ message: 'Invalid authentication token.' });
  }
};

const adminMiddleware = async (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

// Optional auth for public routes that want to enhance data if logged in
const optionalAuth = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'codesolver_jwt_secret_key_change_in_production_2024');
      req.userId = decoded.id;
      req.user = decoded;
      const userDoc = await User.findById(decoded.id).select('name email role');
      if (userDoc) {
        req.userRole = userDoc.role || 'user';
      }
    }
  } catch (e) {
    // Ignore invalid token in optional auth
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, optionalAuth };
