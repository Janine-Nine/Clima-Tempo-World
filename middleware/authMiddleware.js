const jwt = require('jsonwebtoken');
const SECRET = 'segredo_super_forte';

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.sendStatus(403);

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.sendStatus(401);
  }
};