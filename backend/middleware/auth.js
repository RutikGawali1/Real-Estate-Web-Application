// middleware/verifyToken.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: 'Access Denied: No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded should contain user data like { id, name, email }
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email
    };

    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Invalid Token' });
  }
}

module.exports = verifyToken;
