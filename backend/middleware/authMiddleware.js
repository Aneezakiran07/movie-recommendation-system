const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; // Store in env in production

//console.log (JWT_SECRET);

const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, access denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // adds user { id, email } to request
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;