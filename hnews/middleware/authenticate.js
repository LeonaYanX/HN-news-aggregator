const jwt = require('jsonwebtoken');
const {findUserById} = require('../utils/UserService');
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = { id: user._id }; // adding req.user 
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = {authenticate};
